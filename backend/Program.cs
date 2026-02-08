using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using backend.Filters;

var builder = WebApplication.CreateBuilder(args);

// ────────────────────────────────────────────────
// Add services
// ────────────────────────────────────────────────

// Controllers (for [ApiController], [HttpPost], etc.)
builder.Services.AddControllers();

// Database – PostgreSQL with EF Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
));

builder.Services.AddControllers(opt =>
{
    opt.Filters.Add<RequireAuthenticatedUserFilter>();
});

// CORS - Allow frontend to send credentials (cookies)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Change to your frontend URL
              .AllowCredentials()  // Important: enables cookies
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT Authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer    = builder.Configuration["Jwt:Issuer"],
            ValidAudience  = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:SecretKey"] 
                    ?? throw new InvalidOperationException("Jwt:SecretKey is missing")
                ))
        };
        
        // Read JWT token from cookie
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Check if token exists in cookie
                if (context.Request.Cookies.ContainsKey("jwt"))
                {
                    context.Token = context.Request.Cookies["jwt"];
                }
                return Task.CompletedTask;
            }
        };
    });

// Authorization (needed for [Authorize] attribute)
builder.Services.AddAuthorization();

// Optional: Add Swagger for API documentation (recommended in development)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ────────────────────────────────────────────────
// Middleware pipeline
// ────────────────────────────────────────────────

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS must come before Authentication/Authorization
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Map all controllers
app.MapControllers();

app.Run();