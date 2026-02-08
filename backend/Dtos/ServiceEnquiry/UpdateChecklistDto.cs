namespace backend.Dtos.ServiceEnquiry;
// Base update DTO – common fields for all checklists
public class UpdateChecklistDto
{
    public string? TechnicianNotes { get; set; }
    public DateTime? CompletedAt { get; set; } = DateTime.UtcNow; // auto-set if not provided
}

// Specific checklist update DTOs (add fields you want to update)
public class UpdateTyreChecklistDto : UpdateChecklistDto
{
    public bool? CorrectTyreSizeVerified { get; set; }
    public bool? NoBeadSidewallDamage { get; set; }
    public bool? CorrectInflation { get; set; }
    public bool? WheelNutsTorqued { get; set; }
}

public class UpdateAlignmentChecklistDto : UpdateChecklistDto
{
    public bool? SuspensionChecked { get; set; }
    public bool? SteeringCentered { get; set; }
    public bool? BeforeAfterReportPrinted { get; set; }
}

public class UpdateBalancingChecklistDto : UpdateChecklistDto
{
    public bool? WheelCleaned { get; set; }
    public bool? WeightsFixedSecurely { get; set; }
    public bool? FinalRecheckDone { get; set; }
}

public class UpdatePucChecklistDto : UpdateChecklistDto
{
    public bool? EngineWarmed { get; set; }
    public bool? ProbeInsertedCorrectly { get; set; }
    public bool? CertificatePrintedAndUploaded { get; set; }
}

public class UpdateCarWashChecklistDto : UpdateChecklistDto
{
    public bool? ExteriorWashed { get; set; }
    public bool? InteriorVacuumed { get; set; }
    public bool? NoWaterOnEngineElectrics { get; set; }
}