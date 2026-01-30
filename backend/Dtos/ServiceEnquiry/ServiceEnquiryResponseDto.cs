namespace backend.Dtos.ServiceEnquiry;

public record ServiceEnquiryResponseDto
{
    public Guid Id { get; init; }

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

    public string Status { get; init; } = string.Empty;
    public string ComplaintNotes { get; init; } = string.Empty;

    public string[] SelectedServiceCodes { get; init; } = Array.Empty<string>();

    public TyreChecklistDataDto? TyreChecklist { get; init; }
    public TyreInspectionDataDto? TyreInspection { get; init; }

    public AlignmentChecklistDataDto? AlignmentChecklist { get; init; }
    public AlignmentInspectionDataDto? AlignmentInspection { get; init; }

    public BalancingChecklistDataDto? BalancingChecklist { get; init; }
    public BalancingInspectionDataDto? BalancingInspection { get; init; }

    public PucChecklistDataDto? PucChecklist { get; init; }
    public PucInspectionDataDto? PucInspection { get; init; }

    public CarWashChecklistDataDto? CarWashChecklist { get; init; }
    public CarWashInspectionDataDto? CarWashInspection { get; init; }

    public BatteryInspectionDataDto? BatteryInspection { get; init; }
    public OilInspectionDataDto? OilInspection { get; init; }

    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}