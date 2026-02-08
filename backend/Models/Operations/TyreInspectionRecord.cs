using backend.Models.auth;

namespace backend.Models.Operations;

// Enum for tyre positions (matches your frontend TyrePosition type)
public enum TyrePosition
{
    FrontLeft,
    FrontRight,
    RearLeft,
    RearRight,
    Spare,      // optional, if you want to include spare tyre
    None        // for cases where no specific tyre is selected
}

// Record for individual tyre measurement (matches TyreValues in Redux)
public record TyreValues
{
    public string TreadDepth { get; init; } = "Good";  // "Good" | "Average" | "Replace"
    public int TyrePressure { get; init; }             // e.g. 32, 35, etc. (in PSI)
};


public class TyreInspectionRecord
{
    public Guid Id { get; set; }

    public Guid ServiceEnquiryId { get; set; }
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    // From Redux tyreInspection
    public TyrePosition? SelectedTyre { get; set; }  // which tyre was focused on during inspection

    public TyreValues? FrontLeft { get; set; }
    public TyreValues? FrontRight { get; set; }
    public TyreValues? RearLeft { get; set; }
    public TyreValues? RearRight { get; set; }

    public string[] SelectedComplaints { get; set; } = Array.Empty<string>();
    public string? CustomComplaint { get; set; }

    // Tyre Rotation fields (merged here since often done together with inspection)
    public string? RotationType { get; set; }           // "4-tyre" | "unidirectional" | "5-tyre" | null
    public string? RotationComplaint { get; set; }

    // General
    public string? Notes { get; set; }                  // technician notes
    public DateTime? CompletedAt { get; set; }  

      public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid? UpdatedBy { get; set; }          // nullable
    public DateTime? UpdatedAt { get; set; }      // nullable

    public User? CreatedByUser { get; set; }
    public User? UpdatedByUser { get; set; }
}