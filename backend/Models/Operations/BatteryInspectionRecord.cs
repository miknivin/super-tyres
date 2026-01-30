namespace backend.Models.Operations;

// Enum for battery condition (matches frontend: "Good" | "Average" | "Replace")
public enum BatteryCondition
{
    Good,
    Average,
    Replace
}

/// <summary>
/// Detailed battery inspection record for a job card.
/// Captures condition, voltage, specific gravity, and complaint.
/// </summary>
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
}