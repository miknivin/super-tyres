using backend.Models.Operations;
namespace backend.Models.Operations;
public class BalancingChecklistRecord
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    public bool WheelCleaned { get; set; }
    public bool WeightsFixedSecurely { get; set; }
    public bool FinalRecheckDone { get; set; }

    public string? TechnicianNotes { get; set; }
    public DateTime? CompletedAt { get; set; }
}