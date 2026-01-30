using backend.Models.Operations;
namespace backend.Models.Operations;
public class CarWashInspectionRecord
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    public string[] SelectedServices { get; set; } = Array.Empty<string>();
    public string? Complaint { get; set; }

    public string? Notes { get; set; }
    public DateTime? CompletedAt { get; set; }
}