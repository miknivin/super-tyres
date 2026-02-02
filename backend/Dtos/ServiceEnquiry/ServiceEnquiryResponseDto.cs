namespace backend.Dtos.ServiceEnquiry;
public class ServiceEnquiryResponseDto
{
    public Guid Id { get; set; }

    // Customer & Vehicle
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerAddress { get; set; }
    public string? CustomerCity { get; set; }
    public string? PinCode { get; set; }

    public string VehicleName { get; set; } = string.Empty;
    public string VehicleNo { get; set; } = string.Empty;
    public int Odometer { get; set; }
    public string Wheel { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;

    public DateTime? ServiceDate { get; set; }

    // General
    public string ComplaintNotes { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";

    // Timestamps
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<string> SelectedServiceCodes { get; set; } = new();
    // Selected services (flat list – no back-reference)
    public List<ServiceEnquiryServiceResponseDto> SelectedServices { get; set; } = new();
    // All inspections – nullable so they only appear when relevant
    public TyreInspectionResponseDto? TyreInspection { get; set; }
    public TyreRotationInspectionResponseDto? TyreRotationInspection { get; set; }
    public AlignmentInspectionResponseDto? AlignmentInspection { get; set; }
    public BalancingInspectionResponseDto? BalancingInspection { get; set; }
    public PucInspectionResponseDto? PucInspection { get; set; }
    public CarWashInspectionResponseDto? CarWashInspection { get; set; }
    public BatteryInspectionResponseDto? BatteryInspection { get; set; }
    public OilInspectionResponseDto? OilInspection { get; set; }
    public List<ServiceWithNameDto>? ServiceWithNames { get; set; }
}

public class ServiceWithNameDto
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class ServiceEnquiryServiceItemDto
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
// ────────────────────────────────────────────────
// Nested DTOs (keep in same file or separate)

public class ServiceEnquiryServiceResponseDto
{
    public Guid ServiceId { get; set; }
    public int ExecutionOrder { get; set; }
    public int? EstimatedMinutes { get; set; }
    public int? ActualMinutes { get; set; }
    public decimal? PriceCharged { get; set; }
    public string? Notes { get; set; }
}

// Tyre Inspection
public class TyreInspectionResponseDto
{
    public Guid Id { get; set; }
    public string? SelectedTyre { get; set; }
    public TyreValuesDto? FrontLeft { get; set; }
    public TyreValuesDto? FrontRight { get; set; }
    public TyreValuesDto? RearLeft { get; set; }
    public TyreValuesDto? RearRight { get; set; }
    public string[]? SelectedComplaints { get; set; }
    public string? CustomComplaint { get; set; }
    public string? RotationType { get; set; }
    public string? RotationComplaint { get; set; }
    public DateTime? CompletedAt { get; set; }
}


// Tyre Rotation Inspection
public class TyreRotationInspectionResponseDto
{
    public Guid Id { get; set; }
    public string? RotationType { get; set; }
    public string? Complaint { get; set; }
    public DateTime? CompletedAt { get; set; }
}

// Alignment Inspection
public class AlignmentInspectionResponseDto
{
    public Guid Id { get; set; }
    public DateTime? LastServiceDate { get; set; }
    public string? Complaint { get; set; }
    public string? InflationPressure { get; set; }
    public DateTime? CompletedAt { get; set; }
}

// Balancing Inspection
public class BalancingInspectionResponseDto
{
    public Guid Id { get; set; }
    public decimal? FrontLeftWeight { get; set; }
    public decimal? FrontRightWeight { get; set; }
    public decimal? RearLeftWeight { get; set; }
    public decimal? RearRightWeight { get; set; }
    public string? Complaint { get; set; }
    public DateTime? CompletedAt { get; set; }
}

// PUC Inspection
public class PucInspectionResponseDto
{
    public Guid Id { get; set; }
    public bool? NormalPUC { get; set; }
    public bool? EngineWarmUp { get; set; }
    public bool? HighRPM { get; set; }
    public bool? IdleRPM { get; set; }
    public bool? CertificatePrint { get; set; }
    public string? FuelType { get; set; }
    public DateTime? CompletedAt { get; set; }
}

// Car Wash Inspection
public class CarWashInspectionResponseDto
{
    public Guid Id { get; set; }
    public string[]? SelectedServices { get; set; }
    public string? Complaint { get; set; }
    public DateTime? CompletedAt { get; set; }
}

// Battery Inspection
public class BatteryInspectionResponseDto
{
    public Guid Id { get; set; }
    public string? Condition { get; set; }      // e.g. "Good", "NeedsReplacement"
    public double? Voltage { get; set; }
    public double? SpecificGravity { get; set; }
    public string? Complaint { get; set; }
    public DateTime? CompletedAt { get; set; }
}

// Oil Inspection (already had it – included for completeness)
public class OilInspectionResponseDto
{
    public Guid Id { get; set; }
    public string? Quality { get; set; }     // e.g. "Good", "Fair"
    public string? Level { get; set; }       // e.g. "Normal", "Low"
    public string? Complaint { get; set; }
    public DateTime? CompletedAt { get; set; }
}