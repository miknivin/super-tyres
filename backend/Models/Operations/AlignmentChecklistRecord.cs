using backend.Models.Operations;
namespace backend.Models.Operations;
public class AlignmentChecklistRecord
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    public bool SuspensionChecked { get; set; }
    public bool SteeringCentered { get; set; }
    public bool BeforeAfterReportPrinted { get; set; }

    public string? TechnicianNotes { get; set; }
    public DateTime? CompletedAt { get; set; }
}