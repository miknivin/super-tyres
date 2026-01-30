namespace backend.Dtos.ServiceEnquiry;

public record CreateServiceEnquiryDto
{
    // Customer & Vehicle
    public string CustomerName { get; init; } = string.Empty;
    public string CustomerPhone { get; init; } = string.Empty;
    public string? CustomerAddress { get; init; }
    public string? CustomerCity { get; init; }
    public string? PinCode { get; init; }
    public string VehicleName { get; init; } = string.Empty;
    public string VehicleNo { get; init; } = string.Empty;
    public string? Odometer { get; init; }
    public string Wheel { get; init; } = "";
    public string VehicleType { get; init; } = "";
    public DateTime? ServiceDate { get; init; }

    // General
    public string ComplaintNotes { get; init; } = string.Empty;

    // Selected service codes (e.g. ["TYRE_INSPECT", "WHEEL_ALIGN"])
    public string[] SelectedServices { get; init; } = Array.Empty<string>();

    // Inspection data — send only what's relevant
    public TyreInspectionDataDto? TyreInspection { get; init; }
    public AlignmentInspectionDataDto? AlignmentInspection { get; init; }
    public BalancingInspectionDataDto? BalancingInspection { get; init; }
    public TyreRotationInspectionDataDto? TyreRotationInspection { get; init; }
    public PucInspectionDataDto? PucInspection { get; init; }
    public CarWashInspectionDataDto? CarWashInspection { get; init; }
    public BatteryInspectionDataDto? BatteryInspection { get; init; }
    public OilInspectionDataDto? OilInspection { get; init; }
}

// Nested inspection DTOs (match your Redux types)
public record TyreInspectionDataDto
{
    public string? SelectedTyre { get; init; }
    public TyreValuesDto? FrontLeft { get; init; }
    public TyreValuesDto? FrontRight { get; init; }
    public TyreValuesDto? RearLeft { get; init; }
    public TyreValuesDto? RearRight { get; init; }
    public string[] SelectedComplaints { get; init; } = Array.Empty<string>();
    public string? CustomComplaint { get; init; }
    public string? RotationType { get; init; }
    public string? RotationComplaint { get; init; }
}


public record TyreRotationInspectionDataDto
{
    public string? RotationType { get; init; }  // "4-tyre" | "unidirectional" | "5-tyre" | null
    public string Complaint { get; init; } = string.Empty;
}
public record TyreValuesDto
{
    public string TreadDepth { get; init; } = "Good";
    public int TyrePressure { get; init; }
}

public record AlignmentInspectionDataDto
{
    public string? LastServiceDate { get; init; }
    public string? Complaint { get; init; }
    public string InflationPressure { get; init; } = "NO";
}

public record BalancingInspectionDataDto
{
    public string FrontLeftWeight { get; init; } = "";
    public string FrontRightWeight { get; init; } = "";
    public string RearLeftWeight { get; init; } = "";
    public string RearRightWeight { get; init; } = "";
    public string? Complaint { get; init; }
}

public record PucInspectionDataDto
{
    public bool NormalPUC { get; init; }
    public bool EngineWarmUp { get; init; }
    public bool HighRPM { get; init; }
    public bool IdleRPM { get; init; }
    public bool CertificatePrint { get; init; }
    public string? FuelType { get; init; }
}

public record CarWashInspectionDataDto
{
    public string[] SelectedServices { get; init; } = Array.Empty<string>();
    public string? Complaint { get; init; }
}

public record BatteryInspectionDataDto
{
    public string? Condition { get; init; }
    public double Voltage { get; init; }
    public double SpecificGravity { get; init; }
    public string Complaint { get; init; } = string.Empty;
}

public record OilInspectionDataDto
{
    public string? Quality { get; init; }
    public string? Level { get; init; }
    public string Complaint { get; init; } = string.Empty;
}