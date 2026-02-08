using backend.Models.auth;

namespace backend.Models.Operations;

// Enum for battery condition (matches frontend: "Good" | "Average" | "Replace")
public enum BatteryCondition
{
    Good,
    Average,
    Replace
}

public class BatteryInspectionRecord
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;
    public BatteryCondition? Condition { get; set; }
    public double Voltage { get; set; }
    public double SpecificGravity { get; set; }
    public string Complaint { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime? CompletedAt { get; set; }
      public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid? UpdatedBy { get; set; }          // nullable
    public DateTime? UpdatedAt { get; set; }      // nullable

    public User? CreatedByUser { get; set; }
    public User? UpdatedByUser { get; set; }
}