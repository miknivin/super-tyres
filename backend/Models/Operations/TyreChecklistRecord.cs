using backend.Models.Operations;
namespace backend.Models.Operations;
public class TyreChecklistRecord
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    public bool CorrectTyreSizeVerified { get; set; }
    public bool NoBeadSidewallDamage { get; set; }
    public bool CorrectInflation { get; set; }
    public bool WheelNutsTorqued { get; set; }

    public string? TechnicianNotes { get; set; }
    public DateTime? CompletedAt { get; set; }
}