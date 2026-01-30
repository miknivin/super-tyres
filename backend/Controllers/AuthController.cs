
using backend.Data;
using backend.Dtos;
using backend.Models.auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(AppDbContext context, IConfiguration configuration) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly IConfiguration _configuration = configuration;

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                return BadRequest("Username already taken");

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already taken");

            if (!string.IsNullOrWhiteSpace(dto.EmployeeId) &&
                await _context.Users.AnyAsync(u => u.EmployeeId == dto.EmployeeId))
                return BadRequest("Employee ID already in use");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                Username     = dto.Username,
                Email        = dto.Email,
                PasswordHash = passwordHash,
                Role         = dto.Role,
                EmployeeId   = dto.EmployeeId ?? string.Empty
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message    = "User registered successfully",
                username   = user.Username,
                role       = user.Role.ToString(),
                employeeId = user.EmployeeId
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name,           user.Username),
                new Claim(ClaimTypes.Email,          user.Email),
                new Claim(ClaimTypes.Role,           user.Role.ToString()),
                new Claim("EmployeeId",              user.EmployeeId)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

           var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(
                    _configuration.GetValue<int>("Jwt:ExpiryInDays")
                ),
                signingCredentials: creds
            );


            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,  // Prevents JavaScript access (XSS protection)
                    Secure = false,    // Only send over HTTPS
                    SameSite = SameSiteMode.Strict,  // CSRF protection
                    Expires = token.ValidTo  // Cookie expires with token
                };
                
                Response.Cookies.Append("jwt", jwt, cookieOptions);

            return Ok(new AuthResponse(
                user.Username,
                jwt,
                token.ValidTo,
                user.Role.ToString(),
                user.EmployeeId
            ));
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var username   = User.FindFirst(ClaimTypes.Name)?.Value;
            var email      = User.FindFirst(ClaimTypes.Email)?.Value;
            var role       = User.FindFirst(ClaimTypes.Role)?.Value;
            var employeeId = User.FindFirst("EmployeeId")?.Value;

            if (string.IsNullOrEmpty(username))
                return Unauthorized();

            return Ok(new UserInfoResponse(
                username,
                email ?? string.Empty,
                role ?? "Unknown",
                employeeId
            ));
        }
    }
}