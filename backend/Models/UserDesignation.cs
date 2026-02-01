using backend.Models.auth;

namespace backend.Models;

public class UserDesignation
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid DesignationId { get; set; }
    public Designation Designation { get; set; } = null!;

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
}