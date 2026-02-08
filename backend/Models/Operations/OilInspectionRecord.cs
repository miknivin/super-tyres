using backend.Models.auth;

namespace backend.Models.Operations;

// Enum for oil quality rating (matches frontend: "Good" | "Average" | "Replace" | null)
public enum OilQuality
{
    Good,
    Average,
    Replace
}

// Enum for oil level status (matches frontend: "Max" | "Normal" | "Min" | "Immediately Fill" | null)
public enum OilLevel
{
    Max,
    Normal,
    Min,
    ImmediatelyFill
}


public class OilInspectionRecord
{
    public Guid Id { get; set; }

    public Guid ServiceEnquiryId { get; set; }

    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;


    public OilQuality? Quality { get; set; }

    public OilLevel? Level { get; set; }

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