using backend.Models.auth;

namespace backend.Models.Operations;

public class TyreRotationInspectionRecord
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    // Make RotationType required (non-nullable)
    public string RotationType { get; set; } = null!;  // "4-tyre", "unidirectional", "5-tyre"

    // Make Complaint optional
    public string? Complaint { get; set; }

    public string? Notes { get; set; }
    public DateTime? CompletedAt { get; set; }

    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid? UpdatedBy { get; set; }          // nullable
    public DateTime? UpdatedAt { get; set; }      // nullable

    public User? CreatedByUser { get; set; }
    public User? UpdatedByUser { get; set; }
}
