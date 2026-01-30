namespace backend.Dtos.ServiceEnquiry;

public record UpdateChecklistDto
{
    public Guid ServiceEnquiryId { get; init; }

    // Send only one checklist type at a time
    public TyreChecklistDataDto? TyreChecklist { get; init; }
    public AlignmentChecklistDataDto? AlignmentChecklist { get; init; }
    public BalancingChecklistDataDto? BalancingChecklist { get; init; }
    public PucChecklistDataDto? PucChecklist { get; init; }
    public CarWashChecklistDataDto? CarWashChecklist { get; init; }
}

public record TyreChecklistDataDto
{
    public bool CorrectTyreSizeVerified { get; init; }
    public bool NoBeadSidewallDamage { get; init; }
    public bool CorrectInflation { get; init; }
    public bool WheelNutsTorqued { get; init; }
    public string? TechnicianNotes { get; init; }
}

public record AlignmentChecklistDataDto
{
    public bool SuspensionChecked { get; init; }
    public bool SteeringCentered { get; init; }
    public bool BeforeAfterReportPrinted { get; init; }
    public string? TechnicianNotes { get; init; }
}

public record BalancingChecklistDataDto
{
    public bool WheelCleaned { get; init; }
    public bool WeightsFixedSecurely { get; init; }
    public bool FinalRecheckDone { get; init; }
    public string? TechnicianNotes { get; init; }
}

public record PucChecklistDataDto
{
    public bool EngineWarmed { get; init; }
    public bool ProbeInsertedCorrectly { get; init; }
    public bool CertificatePrintedAndUploaded { get; init; }
    public string? TechnicianNotes { get; init; }
}

public record CarWashChecklistDataDto
{
    public bool ExteriorWashed { get; init; }
    public bool InteriorVacuumed { get; init; }
    public bool NoWaterOnEngineElectrics { get; init; }
    public string? TechnicianNotes { get; init; }
}