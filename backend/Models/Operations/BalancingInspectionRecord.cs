using backend.Models.auth;
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
      public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid? UpdatedBy { get; set; }          // nullable
    public DateTime? UpdatedAt { get; set; }      // nullable

    public User? CreatedByUser { get; set; }
    public User? UpdatedByUser { get; set; }
}
