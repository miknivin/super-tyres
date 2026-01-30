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
}