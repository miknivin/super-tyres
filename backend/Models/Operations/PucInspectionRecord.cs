using backend.Models.Operations;

public class PucInspectionRecord
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    public bool NormalPUC { get; set; } = true;
    public bool EngineWarmUp { get; set; } = false;
    public bool HighRPM { get; set; } = true;
    public bool IdleRPM { get; set; } = false;
    public bool CertificatePrint { get; set; } = false;
    public string? FuelType { get; set; } = "Diesel";

    public string? Notes { get; set; }
    public DateTime? CompletedAt { get; set; }
}