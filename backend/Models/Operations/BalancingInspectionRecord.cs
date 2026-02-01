using backend.Models.Operations;
namespace backend.Models.Operations;
public class BalancingInspectionRecord
{
    public Guid Id { get; set; }

    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    public decimal? FrontLeftWeight { get; set; }
    public decimal? FrontRightWeight { get; set; }
    public decimal? RearLeftWeight { get; set; }
    public decimal? RearRightWeight { get; set; }

    public string? Complaint { get; set; }
    public string? Notes { get; set; }
    public DateTime? CompletedAt { get; set; }
}
