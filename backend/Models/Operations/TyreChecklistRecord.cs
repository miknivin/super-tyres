using backend.Models.auth;
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
    public string ServiceCode { get; set; } = "TYRE_INSPECT";
    public string? TechnicianNotes { get; set; }
    public DateTime? CompletedAt { get; set; }
      public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid? UpdatedBy { get; set; }          // nullable
    public DateTime? UpdatedAt { get; set; }      // nullable

    public User? CreatedByUser { get; set; }
    public User? UpdatedByUser { get; set; }
}