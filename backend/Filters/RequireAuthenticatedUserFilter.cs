// src/Filters/RequireAuthenticatedUserFilter.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Data;           // AppDbContext
using backend.Models.auth;    // User model + RoleType enum

namespace backend.Filters;

public class RequireAuthenticatedUserFilter : IAsyncActionFilter
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;

    public RequireAuthenticatedUserFilter(AppDbContext db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {

        var controllerName = context.ActionDescriptor.RouteValues["controller"];
        if (controllerName == "Auth")
        {
            await next();
            return;
        }
        // 1. Skip auth for public endpoints (login, register, swagger, etc.)
        var endpoint = context.HttpContext.GetEndpoint();
        if (endpoint?.Metadata.GetMetadata<Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute>() != null)
        {
            await next();
            return;
        }

        // 2. Read token from cookie "jwt"
        var token = context.HttpContext.Request.Cookies["jwt"];

        if (string.IsNullOrWhiteSpace(token))
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Missing authentication token (jwt cookie not found)" });
            return;
        }

        // Clean up quotes if present (some clients add them)
        token = token.Trim('"');

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(
                _configuration["Jwt:SecretKey"] 
                ?? throw new InvalidOperationException("JWT SecretKey is not configured in appsettings")
            );

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            };

            // Validate token → get principal
            var principal = tokenHandler.ValidateToken(token, validationParameters, out _);

            // Extract user ID from 'sub' or 'nameidentifier' claim
            var userIdClaim = principal.FindFirst(JwtRegisteredClaimNames.Sub)
                           ?? principal.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || string.IsNullOrWhiteSpace(userIdClaim.Value))
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Token does not contain valid user ID" });
                return;
            }

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Invalid user ID format in token" });
                return;
            }

            // 3. Fetch full user to get Role (and confirm existence)
            var user = await _db.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Authenticated user no longer exists" });
                return;
            }

            // 4. Success: Store both UserId and RoleType for controllers
            context.HttpContext.Items["UserId"]   = user.Id;
            context.HttpContext.Items["UserRole"] = user.Role;  // RoleType enum

            // Optional: debug log (remove in production)
            // Console.WriteLine($"Authenticated: UserId={userId}, Role={user.Role} for path={context.HttpContext.Request.Path}");
        }
        catch (SecurityTokenExpiredException)
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Token has expired" });
            return;
        }
        catch (SecurityTokenInvalidSignatureException)
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Invalid token signature" });
            return;
        }
        catch (Exception ex)
        {
            // Log in real app (use ILogger)
            Console.WriteLine($"Token validation failed: {ex.Message}");
            context.Result = new UnauthorizedObjectResult(new { message = "Invalid or malformed token" });
            return;
        }

        // 5. Proceed to controller action
        await next();
    }
}