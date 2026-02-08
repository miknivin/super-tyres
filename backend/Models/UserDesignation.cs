using System.ComponentModel.DataAnnotations.Schema;
using backend.Models.auth;

namespace backend.Models;

public class UserDesignation
{
    public Guid UserId { get; set; }
    
    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    public Guid DesignationId { get; set; }
    
    [ForeignKey(nameof(DesignationId))]
    public Designation Designation { get; set; } = null!;

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    // ── NEW FIELD ────────────────────────────────────────────────────────────
    public Guid? AssignedById { get; set; }          // Who assigned this designation

    [ForeignKey(nameof(AssignedById))]
    public User? AssignedBy { get; set; }            // Navigation property (optional)
    // ────────────────────────────────────────────────────────────────────────
}