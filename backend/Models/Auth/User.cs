namespace backend.Models.auth;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public RoleType Role { get; set; } = RoleType.Employee;  // Default value – change as needed
    public ICollection<UserDesignation> UserDesignations { get; set; } = new List<UserDesignation>();
    public string EmployeeId { get; set; } = string.Empty;  // e.g. "EMP-001", "TECH-042"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}