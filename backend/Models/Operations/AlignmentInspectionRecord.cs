using backend.Models.Operations;

namespace backend.Models.Operations;
public class AlignmentInspectionRecord
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    public string? LastServiceDate { get; set; }
    public string? Complaint { get; set; }
    public string InflationPressure { get; set; } = "NO";

    public string? Notes { get; set; }
    public DateTime? CompletedAt { get; set; }
}