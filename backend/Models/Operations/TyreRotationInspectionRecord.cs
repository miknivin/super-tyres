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
}
