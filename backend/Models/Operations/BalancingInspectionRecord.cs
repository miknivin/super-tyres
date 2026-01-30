using backend.Models.Operations;

public class BalancingInspectionRecord
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    public string FrontLeftWeight { get; set; } = "";
    public string FrontRightWeight { get; set; } = "";
    public string RearLeftWeight { get; set; } = "";
    public string RearRightWeight { get; set; } = "";
    public string? Complaint { get; set; }

    public string? Notes { get; set; }
    public DateTime? CompletedAt { get; set; }
}