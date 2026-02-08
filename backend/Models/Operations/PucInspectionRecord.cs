using backend.Models.auth;
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
      public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid? UpdatedBy { get; set; }          // nullable
    public DateTime? UpdatedAt { get; set; }      // nullable

    public User? CreatedByUser { get; set; }
    public User? UpdatedByUser { get; set; }
}