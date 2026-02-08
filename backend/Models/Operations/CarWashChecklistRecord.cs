using backend.Models.auth;
using backend.Models.Operations;
namespace backend.Models.Operations;
public class CarWashChecklistRecord
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    public bool ExteriorWashed { get; set; }
    public bool InteriorVacuumed { get; set; }
    public bool NoWaterOnEngineElectrics { get; set; }

    public string? TechnicianNotes { get; set; }
    public DateTime? CompletedAt { get; set; }
      public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string ServiceCode { get; set; } = "CAR_WASH";
    public Guid? UpdatedBy { get; set; }          // nullable
    public DateTime? UpdatedAt { get; set; }      // nullable

    public User? CreatedByUser { get; set; }
    public User? UpdatedByUser { get; set; }
}