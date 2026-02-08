using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models.ServiceManagement;

namespace backend.Models;

public class Designation
{
    public Guid Id { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, StringLength(50)]
    public string Code { get; set; } = string.Empty;

    public string? Description { get; set; }

    public Guid? ServiceId { get; set; }
    public Service? Service { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string? ImageUrl { get; set; }

    // Many-to-Many with User
    public ICollection<UserDesignation> UserDesignations { get; set; } = new List<UserDesignation>();

    // ── Computed property: always gives you a usable full URL ────────────────
    // No database column — computed at runtime
    [NotMapped]
    public string? FullImageUrl
    {
        get
        {
            if (string.IsNullOrWhiteSpace(ImageUrl))
                return null;

            var url = ImageUrl.Trim();

            // Already a full URL? (http/https) → return as-is
            if (url.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
                url.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            {
                return url;
            }

            // Otherwise assume it's a relative path/filename → prepend base path
            // You can later move this prefix to appsettings.json or config
            return $"/assets/services/{url.TrimStart('/')}";
        }
    }
}