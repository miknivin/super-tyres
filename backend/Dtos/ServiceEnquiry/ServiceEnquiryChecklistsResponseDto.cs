namespace backend.Dtos;

public class ServiceEnquiryChecklistsResponseDto
{
    public Guid ServiceEnquiryId { get; set; }
    public List<string> SelectedServiceCodes { get; set; } = new();

    // Checklists – only populated if they exist for the selected services
    public TyreChecklistResponseDto? TyreChecklist { get; set; }
    public AlignmentChecklistResponseDto? AlignmentChecklist { get; set; }
    public BalancingChecklistResponseDto? BalancingChecklist { get; set; }
    public PucChecklistResponseDto? PucChecklist { get; set; }
    public CarWashChecklistResponseDto? CarWashChecklist { get; set; }
}

// Minimal DTOs for each checklist (expand fields as per your schema)
public class TyreChecklistResponseDto
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public bool CorrectTyreSizeVerified { get; set; }
    public bool NoBeadSidewallDamage { get; set; }
    public bool CorrectInflation { get; set; }
    public bool WheelNutsTorqued { get; set; }

    public string? TechnicianNotes { get; set; }
    public DateTime? CompletedAt { get; set; }
  
}

public class AlignmentChecklistResponseDto
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public bool SuspensionChecked { get; set; }
    public bool SteeringCentered { get; set; }
    public bool BeforeAfterReportPrinted { get; set; }
    public string? TechnicianNotes { get; set; }
    public DateTime? CompletedAt { get; set; }

}

public class BalancingChecklistResponseDto
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }

    public bool WheelCleaned { get; set; }
    public bool WeightsFixedSecurely { get; set; }
    public bool FinalRecheckDone { get; set; }

    public string? TechnicianNotes { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class PucChecklistResponseDto
{
    public Guid Id { get; set; }
     public Guid ServiceEnquiryId { get; set; }
    public bool EngineWarmed { get; set; }
    public bool ProbeInsertedCorrectly { get; set; }
    public bool CertificatePrintedAndUploaded { get; set; }
    public string? TechnicianNotes { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class CarWashChecklistResponseDto
{
    public Guid Id { get; set; }
    public Guid ServiceEnquiryId { get; set; }
    public bool ExteriorWashed { get; set; }
    public bool InteriorVacuumed { get; set; }
    public bool NoWaterOnEngineElectrics { get; set; }
    public string? TechnicianNotes { get; set; }
    public DateTime? CompletedAt { get; set; }
}