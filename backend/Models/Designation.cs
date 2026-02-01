using System.ComponentModel.DataAnnotations;
using backend.Models.ServiceManagement;

namespace backend.Models;

public class Designation
{
    public Guid Id { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty; // e.g. "Alignment Inspector"

    [Required, StringLength(50)]
    public string Code { get; set; } = string.Empty; // e.g. "ALIGN_INSPECTOR" (unique)

    public string? Description { get; set; }

    public Guid? ServiceId { get; set; } // Optional: tied to a specific service (e.g. Alignment)
    public Service? Service { get; set; } // Navigation property

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Many-to-Many with User
    public ICollection<UserDesignation> UserDesignations { get; set; } = new List<UserDesignation>();
}