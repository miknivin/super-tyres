// Battery
public class BatteryInspectionDto
{
    public string? Condition { get; set; }          // "Good" | "Average" | "Replace" | null
    public double Voltage { get; set; }
    public double SpecificGravity { get; set; }
    public string Complaint { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime? CompletedAt { get; set; }
}

// Oil
public class OilInspectionDto
{
    public string? Quality { get; set; }           // "Good" | "Average" | "Replace" | null
    public string? Level { get; set; }             // "Max" | "Normal" | "Min" | "ImmediatelyFill" | null
    public string Complaint { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime? CompletedAt { get; set; }
}

// Tyre Rotation
public class TyreRotationInspectionDto
{
    public string RotationType { get; set; } = string.Empty;  // "4-tyre" | "unidirectional" | "5-tyre"
    public string? Complaint { get; set; }
    public string? Notes { get; set; }
    public DateTime? CompletedAt { get; set; }
}