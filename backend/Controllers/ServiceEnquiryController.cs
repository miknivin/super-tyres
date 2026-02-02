using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.Operations;
using backend.Dtos.ServiceEnquiry;
using backend.Dtos;

namespace backend.Controllers;

[ApiController]
[Route("api/service-enquiry")]
public class ServiceEnquiryController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;



[HttpPost]
public async Task<IActionResult> CreateServiceEnquiry([FromBody] CreateServiceEnquiryDto dto)
{
    // 1. Create enquiry entity
    var enquiry = new ServiceEnquiry
    {
        CustomerName = dto.CustomerName,
        CustomerPhone = dto.CustomerPhone,
        CustomerAddress = dto.CustomerAddress,
        CustomerCity = dto.CustomerCity,
        PinCode = dto.PinCode,
        VehicleName = dto.VehicleName,
        VehicleNo = dto.VehicleNo,
        Odometer = dto.Odometer,
        Wheel = dto.Wheel,
        VehicleType = dto.VehicleType,
        ServiceDate = dto.ServiceDate,
        ComplaintNotes = dto.ComplaintNotes,
        Status = "Pending",
        CreatedAt = DateTime.UtcNow
    };

    // 2. Load all services in ONE query
    var services = await _context.Services
        .AsNoTracking()
        .Where(s => dto.SelectedServices.Contains(s.Code))
        .ToDictionaryAsync(s => s.Code);

    var serviceEnquiryServices = new List<ServiceEnquiryService>();

    foreach (var code in dto.SelectedServices.Distinct())
    {
        if (!services.TryGetValue(code, out var service))
            return BadRequest($"Invalid service code: {code}");

        serviceEnquiryServices.Add(new ServiceEnquiryService
        {
            ServiceId = service.Id,
            ExecutionOrder = serviceEnquiryServices.Count
        });
    }

    // 3. Add enquiry + services
    enquiry.SelectedServices = serviceEnquiryServices;
    _context.ServiceEnquiries.Add(enquiry);

    // 4. Add inspection records (NO async here)
    foreach (var code in dto.SelectedServices.Distinct())
    {
        switch (code.ToUpperInvariant())
        {
            case "TYRE_INSPECT" when dto.TyreInspection != null:
                _context.TyreInspectionRecords.Add(new TyreInspectionRecord
                {
                    ServiceEnquiry = enquiry,
                    SelectedTyre = Enum.TryParse<TyrePosition>(dto.TyreInspection.SelectedTyre, true, out var pos) ? pos : null,
                    FrontLeft = dto.TyreInspection.FrontLeft == null ? null :
                        new TyreValues { TreadDepth = dto.TyreInspection.FrontLeft.TreadDepth, TyrePressure = dto.TyreInspection.FrontLeft.TyrePressure },
                    FrontRight = dto.TyreInspection.FrontRight == null ? null :
                        new TyreValues { TreadDepth = dto.TyreInspection.FrontRight.TreadDepth, TyrePressure = dto.TyreInspection.FrontRight.TyrePressure },
                    RearLeft = dto.TyreInspection.RearLeft == null ? null :
                        new TyreValues { TreadDepth = dto.TyreInspection.RearLeft.TreadDepth, TyrePressure = dto.TyreInspection.RearLeft.TyrePressure },
                    RearRight = dto.TyreInspection.RearRight == null ? null :
                        new TyreValues { TreadDepth = dto.TyreInspection.RearRight.TreadDepth, TyrePressure = dto.TyreInspection.RearRight.TyrePressure },
                    SelectedComplaints = dto.TyreInspection.SelectedComplaints ?? Array.Empty<string>(),
                    CustomComplaint = dto.TyreInspection.CustomComplaint,
                    RotationType = dto.TyreInspection.RotationType,
                    RotationComplaint = dto.TyreInspection.RotationComplaint,
                    CompletedAt = DateTime.UtcNow
                });
                break;

            case "TYRE_ROT" when dto.TyreRotationInspection != null:
                _context.TyreRotationInspectionRecords.Add(new TyreRotationInspectionRecord
                {
                    ServiceEnquiry = enquiry,
                    RotationType = dto.TyreRotationInspection.RotationType,
                    Complaint = dto.TyreRotationInspection.Complaint,
                    CompletedAt = DateTime.UtcNow
                });
                break;

            case "ALIGNMENT" when dto.AlignmentInspection != null:
                _context.AlignmentInspectionRecords.Add(new AlignmentInspectionRecord
                {
                    ServiceEnquiry = enquiry,
                    LastServiceDate = dto.AlignmentInspection.LastServiceDate,
                    Complaint = dto.AlignmentInspection.Complaint,
                    InflationPressure = dto.AlignmentInspection.InflationPressure,
                    CompletedAt = DateTime.UtcNow
                });
                break;

            case "BALANCING" when dto.BalancingInspection != null:
                _context.BalancingInspectionRecords.Add(new BalancingInspectionRecord
                {
                    ServiceEnquiry = enquiry,
                    FrontLeftWeight = dto.BalancingInspection.FrontLeftWeight,
                    FrontRightWeight = dto.BalancingInspection.FrontRightWeight,
                    RearLeftWeight = dto.BalancingInspection.RearLeftWeight,
                    RearRightWeight = dto.BalancingInspection.RearRightWeight,
                    Complaint = dto.BalancingInspection.Complaint,
                    CompletedAt = DateTime.UtcNow
                });
                break;

            case "CAR_WASH" when dto.CarWashInspection != null:
                _context.CarWashInspectionRecords.Add(new CarWashInspectionRecord
                {
                    ServiceEnquiry = enquiry,
                    SelectedServices = dto.CarWashInspection.SelectedServices ?? Array.Empty<string>(),
                    Complaint = dto.CarWashInspection.Complaint,
                    CompletedAt = DateTime.UtcNow
                });
                break;

            case "PUC" when dto.PucInspection != null:
                _context.PucInspectionRecords.Add(new PucInspectionRecord
                {
                    ServiceEnquiry = enquiry,
                    NormalPUC = dto.PucInspection.NormalPUC,
                    EngineWarmUp = dto.PucInspection.EngineWarmUp,
                    HighRPM = dto.PucInspection.HighRPM,
                    IdleRPM = dto.PucInspection.IdleRPM,
                    CertificatePrint = dto.PucInspection.CertificatePrint,
                    FuelType = dto.PucInspection.FuelType,
                    CompletedAt = DateTime.UtcNow
                });
                break;

            case "BATTERY_CHECK" when dto.BatteryInspection != null:
                _context.BatteryInspectionRecords.Add(new BatteryInspectionRecord
                {
                    ServiceEnquiry = enquiry,
                    Condition = Enum.TryParse<BatteryCondition>(dto.BatteryInspection.Condition, true, out var cond) ? cond : null,
                    Voltage = dto.BatteryInspection.Voltage,
                    SpecificGravity = dto.BatteryInspection.SpecificGravity,
                    Complaint = dto.BatteryInspection.Complaint,
                    CompletedAt = DateTime.UtcNow
                });
                break;

            case "OIL_CHECK" when dto.OilInspection != null:
                _context.OilInspectionRecords.Add(new OilInspectionRecord
                {
                    ServiceEnquiry = enquiry,
                    Quality = Enum.TryParse<OilQuality>(dto.OilInspection.Quality, true, out var qual) ? qual : null,
                    Level = Enum.TryParse<OilLevel>(dto.OilInspection.Level, true, out var lvl) ? lvl : null,
                    Complaint = dto.OilInspection.Complaint,
                    CompletedAt = DateTime.UtcNow
                });
                break;
        }
    }

    // 5. Single atomic save
    await _context.SaveChangesAsync();

    // 6. Reload with Includes for response
    var savedEnquiry = await _context.ServiceEnquiries
        .AsNoTracking()
        .Include(e => e.SelectedServices)
        .Include(e => e.TyreInspection)
        .Include(e => e.TyreRotationInspection)
        .Include(e => e.AlignmentInspection)
        .Include(e => e.BalancingInspection)
        .Include(e => e.CarWashInspection)
        .Include(e => e.PucInspection)
        .Include(e => e.BatteryInspection)
        .Include(e => e.OilInspection)
        .FirstAsync(e => e.Id == enquiry.Id);

    var response = new ServiceEnquiryResponseDto
{
    Id = savedEnquiry.Id,

    CustomerName = savedEnquiry.CustomerName,
    CustomerPhone = savedEnquiry.CustomerPhone,
    CustomerAddress = savedEnquiry.CustomerAddress,
    CustomerCity = savedEnquiry.CustomerCity,
    PinCode = savedEnquiry.PinCode,

    VehicleName = savedEnquiry.VehicleName,
    VehicleNo = savedEnquiry.VehicleNo,
    Odometer = savedEnquiry.Odometer,
    Wheel = savedEnquiry.Wheel,
    VehicleType = savedEnquiry.VehicleType,

    ServiceDate = savedEnquiry.ServiceDate,

    ComplaintNotes = savedEnquiry.ComplaintNotes,
    Status = savedEnquiry.Status,

    CreatedAt = savedEnquiry.CreatedAt,
    UpdatedAt = savedEnquiry.UpdatedAt,

    SelectedServices = savedEnquiry.SelectedServices
        .OrderBy(s => s.ExecutionOrder)
        .Select(s => new ServiceEnquiryServiceResponseDto
        {
            ServiceId = s.ServiceId,
            ExecutionOrder = s.ExecutionOrder,
            EstimatedMinutes = s.EstimatedMinutes,
            ActualMinutes = s.ActualMinutes,
            PriceCharged = s.PriceCharged,
            Notes = s.Notes
        })
        .ToList(),

    TyreInspection = savedEnquiry.TyreInspection == null ? null : new TyreInspectionResponseDto
    {
        Id = savedEnquiry.TyreInspection.Id,
        SelectedTyre = savedEnquiry.TyreInspection.SelectedTyre?.ToString(),
        FrontLeft = savedEnquiry.TyreInspection.FrontLeft == null ? null : new TyreValuesDto
        {
            TreadDepth = savedEnquiry.TyreInspection.FrontLeft.TreadDepth,
            TyrePressure = savedEnquiry.TyreInspection.FrontLeft.TyrePressure
        },
        FrontRight = savedEnquiry.TyreInspection.FrontRight == null ? null : new TyreValuesDto
        {
            TreadDepth = savedEnquiry.TyreInspection.FrontRight.TreadDepth,
            TyrePressure = savedEnquiry.TyreInspection.FrontRight.TyrePressure
        },
        RearLeft = savedEnquiry.TyreInspection.RearLeft == null ? null : new TyreValuesDto
        {
            TreadDepth = savedEnquiry.TyreInspection.RearLeft.TreadDepth,
            TyrePressure = savedEnquiry.TyreInspection.RearLeft.TyrePressure
        },
        RearRight = savedEnquiry.TyreInspection.RearRight == null ? null : new TyreValuesDto
        {
            TreadDepth = savedEnquiry.TyreInspection.RearRight.TreadDepth,
            TyrePressure = savedEnquiry.TyreInspection.RearRight.TyrePressure
        },
        SelectedComplaints = savedEnquiry.TyreInspection.SelectedComplaints,
        CustomComplaint = savedEnquiry.TyreInspection.CustomComplaint,
        RotationType = savedEnquiry.TyreInspection.RotationType,
        RotationComplaint = savedEnquiry.TyreInspection.RotationComplaint,
        CompletedAt = savedEnquiry.TyreInspection.CompletedAt
    },

    TyreRotationInspection = savedEnquiry.TyreRotationInspection == null ? null :
        new TyreRotationInspectionResponseDto
        {
            Id = savedEnquiry.TyreRotationInspection.Id,
            RotationType = savedEnquiry.TyreRotationInspection.RotationType,
            Complaint = savedEnquiry.TyreRotationInspection.Complaint,
            CompletedAt = savedEnquiry.TyreRotationInspection.CompletedAt
        },

    AlignmentInspection = savedEnquiry.AlignmentInspection == null ? null :
        new AlignmentInspectionResponseDto
        {
            Id = savedEnquiry.AlignmentInspection.Id,
            LastServiceDate = savedEnquiry.AlignmentInspection.LastServiceDate,
            Complaint = savedEnquiry.AlignmentInspection.Complaint,
            InflationPressure = savedEnquiry.AlignmentInspection.InflationPressure,
            CompletedAt = savedEnquiry.AlignmentInspection.CompletedAt
        },

    BalancingInspection = savedEnquiry.BalancingInspection == null ? null :
        new BalancingInspectionResponseDto
        {
            Id = savedEnquiry.BalancingInspection.Id,
            FrontLeftWeight = savedEnquiry.BalancingInspection.FrontLeftWeight,
            FrontRightWeight = savedEnquiry.BalancingInspection.FrontRightWeight,
            RearLeftWeight = savedEnquiry.BalancingInspection.RearLeftWeight,
            RearRightWeight = savedEnquiry.BalancingInspection.RearRightWeight,
            Complaint = savedEnquiry.BalancingInspection.Complaint,
            CompletedAt = savedEnquiry.BalancingInspection.CompletedAt
        },

    PucInspection = savedEnquiry.PucInspection == null ? null :
        new PucInspectionResponseDto
        {
            Id = savedEnquiry.PucInspection.Id,
            NormalPUC = savedEnquiry.PucInspection.NormalPUC,
            EngineWarmUp = savedEnquiry.PucInspection.EngineWarmUp,
            HighRPM = savedEnquiry.PucInspection.HighRPM,
            IdleRPM = savedEnquiry.PucInspection.IdleRPM,
            CertificatePrint = savedEnquiry.PucInspection.CertificatePrint,
            FuelType = savedEnquiry.PucInspection.FuelType,
            CompletedAt = savedEnquiry.PucInspection.CompletedAt
        },

    CarWashInspection = savedEnquiry.CarWashInspection == null ? null :
        new CarWashInspectionResponseDto
        {
            Id = savedEnquiry.CarWashInspection.Id,
            SelectedServices = savedEnquiry.CarWashInspection.SelectedServices,
            Complaint = savedEnquiry.CarWashInspection.Complaint,
            CompletedAt = savedEnquiry.CarWashInspection.CompletedAt
        },

    BatteryInspection = savedEnquiry.BatteryInspection == null ? null :
        new BatteryInspectionResponseDto
        {
            Id = savedEnquiry.BatteryInspection.Id,
            Condition = savedEnquiry.BatteryInspection.Condition?.ToString(),
            Voltage = savedEnquiry.BatteryInspection.Voltage,
            SpecificGravity = savedEnquiry.BatteryInspection.SpecificGravity,
            Complaint = savedEnquiry.BatteryInspection.Complaint,
            CompletedAt = savedEnquiry.BatteryInspection.CompletedAt
        },

    OilInspection = savedEnquiry.OilInspection == null ? null :
        new OilInspectionResponseDto
        {
            Id = savedEnquiry.OilInspection.Id,
            Quality = savedEnquiry.OilInspection.Quality?.ToString(),
            Level = savedEnquiry.OilInspection.Level?.ToString(),
            Complaint = savedEnquiry.OilInspection.Complaint,
            CompletedAt = savedEnquiry.OilInspection.CompletedAt
        }
};


   return CreatedAtAction(nameof(GetServiceEnquiry), new { id = response.Id }, response);

}

 [HttpGet("{id}/checklists")]
public async Task<IActionResult> GetServiceEnquiryChecklists(Guid id)
{
    var enquiry = await _context.ServiceEnquiries
        .AsNoTracking()
        .Include(e => e.SelectedServices)
            .ThenInclude(es => es.Service)
        .Include(e => e.TyreChecklist)
        .Include(e => e.AlignmentChecklist)
        .Include(e => e.BalancingChecklist)
        .Include(e => e.PucChecklist)
        .Include(e => e.CarWashChecklist)
        .FirstOrDefaultAsync(e => e.Id == id);

    if (enquiry == null)
    {
        return NotFound($"Service enquiry with ID {id} not found.");
    }

    var response = new ServiceEnquiryChecklistsResponseDto
    {
        ServiceEnquiryId = enquiry.Id,
        SelectedServiceCodes = enquiry.SelectedServices
            .Select(es => es.Service?.Code ?? "Unknown")
            .ToList()
    };

    // Tyre Checklist (for Tyre Inspection OR Tyre Rotation)
    if (enquiry.SelectedServices.Any(es => es.Service?.Code == "TYRE_INSPECT" || es.Service?.Code == "TYRE_ROT"))
    {
        if (enquiry.TyreChecklist != null)
        {
            response.TyreChecklist = new TyreChecklistResponseDto
            {
                Id = enquiry.TyreChecklist.Id,
                ServiceEnquiryId = enquiry.TyreChecklist.ServiceEnquiryId,
                CorrectTyreSizeVerified = enquiry.TyreChecklist.CorrectTyreSizeVerified,
                NoBeadSidewallDamage = enquiry.TyreChecklist.NoBeadSidewallDamage,
                CorrectInflation = enquiry.TyreChecklist.CorrectInflation,
                WheelNutsTorqued = enquiry.TyreChecklist.WheelNutsTorqued,
                TechnicianNotes = enquiry.TyreChecklist.TechnicianNotes,
                CompletedAt = enquiry.TyreChecklist.CompletedAt
            };
        }
    }

    // Alignment Checklist
    if (enquiry.SelectedServices.Any(es => es.Service?.Code == "ALIGNMENT"))
    {
        if (enquiry.AlignmentChecklist != null)
        {
            response.AlignmentChecklist = new AlignmentChecklistResponseDto
            {
                Id = enquiry.AlignmentChecklist.Id,
                ServiceEnquiryId = enquiry.AlignmentChecklist.ServiceEnquiryId,
                SuspensionChecked = enquiry.AlignmentChecklist.SuspensionChecked,           // assuming these fields exist
                SteeringCentered = enquiry.AlignmentChecklist.SteeringCentered,
                BeforeAfterReportPrinted = enquiry.AlignmentChecklist.BeforeAfterReportPrinted,
                TechnicianNotes = enquiry.AlignmentChecklist.TechnicianNotes,
                CompletedAt = enquiry.AlignmentChecklist.CompletedAt
            };
        }
    }

    // Balancing Checklist
    if (enquiry.SelectedServices.Any(es => es.Service?.Code == "BALANCING"))
    {
        if (enquiry.BalancingChecklist != null)
        {
            response.BalancingChecklist = new BalancingChecklistResponseDto
            {
                Id = enquiry.BalancingChecklist.Id,
                ServiceEnquiryId = enquiry.BalancingChecklist.ServiceEnquiryId,
                WheelCleaned = enquiry.BalancingChecklist.WheelCleaned,                    // assuming fields
                WeightsFixedSecurely = enquiry.BalancingChecklist.WeightsFixedSecurely,
                FinalRecheckDone = enquiry.BalancingChecklist.FinalRecheckDone,
                TechnicianNotes = enquiry.BalancingChecklist.TechnicianNotes,
                CompletedAt = enquiry.BalancingChecklist.CompletedAt
            };
        }
    }

    // PUC Checklist
    if (enquiry.SelectedServices.Any(es => es.Service?.Code == "PUC"))
    {
        if (enquiry.PucChecklist != null)
        {
            response.PucChecklist = new PucChecklistResponseDto
            {
                Id = enquiry.PucChecklist.Id,
                ServiceEnquiryId = enquiry.PucChecklist.ServiceEnquiryId,
                EngineWarmed = enquiry.PucChecklist.EngineWarmed,                          // assuming fields
                ProbeInsertedCorrectly = enquiry.PucChecklist.ProbeInsertedCorrectly,
                CertificatePrintedAndUploaded = enquiry.PucChecklist.CertificatePrintedAndUploaded,
                TechnicianNotes = enquiry.PucChecklist.TechnicianNotes,
                CompletedAt = enquiry.PucChecklist.CompletedAt
            };
        }
    }

    // Car Wash Checklist
    if (enquiry.SelectedServices.Any(es => es.Service?.Code == "CAR_WASH"))
    {
        if (enquiry.CarWashChecklist != null)
        {
            response.CarWashChecklist = new CarWashChecklistResponseDto
            {
                Id = enquiry.CarWashChecklist.Id,
                ServiceEnquiryId = enquiry.CarWashChecklist.ServiceEnquiryId,
                ExteriorWashed = enquiry.CarWashChecklist.ExteriorWashed,                  // assuming fields
                InteriorVacuumed = enquiry.CarWashChecklist.InteriorVacuumed,
                NoWaterOnEngineElectrics = enquiry.CarWashChecklist.NoWaterOnEngineElectrics,
                TechnicianNotes = enquiry.CarWashChecklist.TechnicianNotes,
                CompletedAt = enquiry.CarWashChecklist.CompletedAt
            };
        }
    }

    return Ok(response);
}
    // GET: Fetch full enquiry with all data
    [HttpGet("{id}")]
    public async Task<IActionResult> GetServiceEnquiry(Guid id)
    {
        var enquiry = await _context.ServiceEnquiries
            .Include(e => e.SelectedServices).ThenInclude(es => es.Service)
            .Include(e => e.TyreChecklist)
            .Include(e => e.TyreInspection)
            .Include(e => e.AlignmentChecklist)
            .Include(e => e.AlignmentInspection)
            .Include(e => e.BalancingChecklist)
            .Include(e => e.BalancingInspection)
            .Include(e => e.PucChecklist)
            .Include(e => e.PucInspection)
            .Include(e => e.CarWashChecklist)
            .Include(e => e.CarWashInspection)
            .Include(e => e.BatteryInspection)
            .Include(e => e.OilInspection)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (enquiry == null) return NotFound();

        // Map to response DTO (implement mapping logic here or use AutoMapper)
        return Ok(enquiry);
    }

    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentServices(
        [FromQuery] string vehicleNo,
        [FromQuery] int take = 10)
    {
        if (string.IsNullOrWhiteSpace(vehicleNo))
            return BadRequest("Vehicle number is required");

        if (take < 1 || take > 50)
            return BadRequest("Take must be between 1 and 50");

        var recentEnquiries = await _context.ServiceEnquiries
            .AsNoTracking()
            .Where(e => EF.Functions.ILike(e.VehicleNo, $"%{vehicleNo.Trim()}%")) // case-insensitive partial match
            .OrderByDescending(e => e.CreatedAt) // or e.ServiceDate if preferred
            .Take(take)
            .Select(e => new
            {
                EnquiryId       = e.Id,
                VehicleNo       = e.VehicleNo,
                CustomerName    = e.CustomerName,
                Status          = e.Status,
                CreatedAt       = e.CreatedAt,
                ServiceDate     = e.ServiceDate,
                Odometer        = e.Odometer,
                SelectedServices = e.SelectedServices.Select(es => es.Service.Name).ToList(),
                ComplaintNotes  = e.ComplaintNotes
            })
            .ToListAsync();

        return Ok(recentEnquiries);
    }

    // GET: api/service-enquiry
[HttpGet]
[HttpGet]
public async Task<ActionResult<IEnumerable<ServiceEnquiryResponseDto>>> GetAllServiceEnquiries()
{
    var enquiries = await _context.ServiceEnquiries
        .AsNoTracking()
        .Include(e => e.SelectedServices)
            .ThenInclude(es => es.Service) // Loads Service.Code and Service.Name
        .OrderByDescending(e => e.CreatedAt) // Newest first
        .ToListAsync();

    var response = enquiries.Select(e => new ServiceEnquiryResponseDto
    {
        Id = e.Id,
        CustomerName = e.CustomerName,
        CustomerPhone = e.CustomerPhone,
        CustomerAddress = e.CustomerAddress,
        CustomerCity = e.CustomerCity,
        PinCode = e.PinCode,
        VehicleName = e.VehicleName,
        VehicleNo = e.VehicleNo,
        Odometer = e.Odometer,
        Wheel = e.Wheel,
        VehicleType = e.VehicleType,
        ServiceDate = e.ServiceDate,
        ComplaintNotes = e.ComplaintNotes,
        Status = e.Status,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt,

        // NEW: Optional property with service code + name (as you wanted)
        ServiceWithNames = e.SelectedServices
            .Select(s => new ServiceWithNameDto
            {
                Code = s.Service?.Code ?? "Unknown",
                Name = s.Service?.Name ?? "Unknown Service"
            })
            .ToList()
    }).ToList();

    return Ok(response);
}
}