// Models/Operations/ServiceEnquiry.cs (main job card)
using backend.Models.auth;

namespace backend.Models.Operations;

public enum ServiceEnquiryStatus
{
    Pending,   // default / initial state
    Completed  // when all checklists/inspections are done and job is finished
}
public class ServiceEnquiry
{
    public Guid Id { get; set; }

    // Customer & Vehicle (flat fields from Redux CustomerVehicleFormData)
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerAddress { get; set; }
    public string? CustomerCity { get; set; }
    public string? PinCode { get; set; }
    public string VehicleName { get; set; } = string.Empty;
    public string VehicleNo { get; set; } = string.Empty;
    public int Odometer { get; set; }
    public string Wheel { get; set; } = "";               // "2-wheeler" | "4-wheeler"
    public string VehicleType { get; set; } = "";         // "sedan" | "suv" | "hatchback"
    public DateTime? ServiceDate { get; set; }

    // General
    public ServiceEnquiryStatus Status { get; set; } = ServiceEnquiryStatus.Pending;
    public string ComplaintNotes { get; set; } = string.Empty;
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid? UpdatedBy { get; set; }    
    public DateTime? UpdatedAt { get; set; }
    public User? CreatedByUser { get; set; }
    public User? UpdatedByUser { get; set; }
    // Selected services (many-to-many)
    public ICollection<ServiceEnquiryService> SelectedServices { get; set; } = new List<ServiceEnquiryService>();

    // Service-specific checklists & inspections (created conditionally)
    public TyreChecklistRecord? TyreChecklist { get; set; }
    public TyreInspectionRecord? TyreInspection { get; set; }
    
    public AlignmentChecklistRecord? AlignmentChecklist { get; set; }
    public AlignmentInspectionRecord? AlignmentInspection { get; set; }
    public TyreRotationInspectionRecord? TyreRotationInspection { get; set; }
    public BalancingChecklistRecord? BalancingChecklist { get; set; }
    public BalancingInspectionRecord? BalancingInspection { get; set; }

    public PucChecklistRecord? PucChecklist { get; set; }
    public PucInspectionRecord? PucInspection { get; set; }

    public CarWashChecklistRecord? CarWashChecklist { get; set; }
    public CarWashInspectionRecord? CarWashInspection { get; set; }

    // Battery & Oil – only inspection, no checklist
    public BatteryInspectionRecord? BatteryInspection { get; set; }
    public OilInspectionRecord? OilInspection { get; set; }
}