
using backend.Models.auth;

namespace backend.Dtos;

public record RegisterDto(
    string Username,
    string Email,
    string Password,
    RoleType Role = RoleType.Employee,
    string? EmployeeId = null
);

public record LoginDto(
    string Username,
    string Password
);

public record AuthResponse(
    string Username,
    string Token,
    DateTime ExpiresAt,
    string Role,
    string? EmployeeId = null
);

public record UserInfoResponse(
    string Username,
    string Email,
    string Role,
    string? EmployeeId = null
);