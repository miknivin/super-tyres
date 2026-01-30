using backend.Models.Operations;
namespace backend.Models.Operations;
public class PucChecklistRecord
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    public bool EngineWarmed { get; set; }
    public bool ProbeInsertedCorrectly { get; set; }
    public bool CertificatePrintedAndUploaded { get; set; }

    public string? TechnicianNotes { get; set; }
    public DateTime? CompletedAt { get; set; }
}