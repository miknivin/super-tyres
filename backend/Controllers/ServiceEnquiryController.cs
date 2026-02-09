using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.Operations;
using backend.Dtos.ServiceEnquiry;
using backend.Dtos;
using backend.Models.auth;
using backend.Helpers;
using Microsoft.AspNetCore.Authorization;
using backend.Dtos.Others;
using backend.Extensions;

namespace backend.Controllers;

[ApiController]
[Route("api/service-enquiry")]
public class ServiceEnquiryController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;



[HttpPost]
public async Task<IActionResult> CreateServiceEnquiry([FromBody] CreateServiceEnquiryDto dto)
{
   if (!HttpContext.Items.TryGetValue("UserId", out var userIdObj) || userIdObj is not Guid userId)
    {
        return Unauthorized("User not authenticated");
    }
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
        Status = ServiceEnquiryStatus.Pending,
        CreatedAt = DateTime.UtcNow,
        CreatedBy = userId
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
                    CompletedAt = DateTime.UtcNow,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
                });
                break;

            case "TYRE_ROT" when dto.TyreRotationInspection != null:
                _context.TyreRotationInspectionRecords.Add(new TyreRotationInspectionRecord
                {
                    ServiceEnquiry = enquiry,
                    RotationType = dto.TyreRotationInspection.RotationType,
                    Complaint = dto.TyreRotationInspection.Complaint,
                    CompletedAt = DateTime.UtcNow,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
                });
                break;

            case "ALIGNMENT" when dto.AlignmentInspection != null:
                _context.AlignmentInspectionRecords.Add(new AlignmentInspectionRecord
                {
                    ServiceEnquiry = enquiry,
                    LastServiceDate = dto.AlignmentInspection.LastServiceDate,
                    Complaint = dto.AlignmentInspection.Complaint,
                    InflationPressure = dto.AlignmentInspection.InflationPressure,
                    CompletedAt = DateTime.UtcNow,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
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
                    CompletedAt = DateTime.UtcNow,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
                });
                break;

            case "CAR_WASH" when dto.CarWashInspection != null:
                _context.CarWashInspectionRecords.Add(new CarWashInspectionRecord
                {
                    ServiceEnquiry = enquiry,
                    SelectedServices = dto.CarWashInspection.SelectedServices ?? Array.Empty<string>(),
                    Complaint = dto.CarWashInspection.Complaint,
                    CompletedAt = DateTime.UtcNow,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
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
                    CompletedAt = DateTime.UtcNow,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
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
                    CompletedAt = DateTime.UtcNow,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
                });
                break;

            case "OIL_CHECK" when dto.OilInspection != null:
                _context.OilInspectionRecords.Add(new OilInspectionRecord
                {
                    ServiceEnquiry = enquiry,
                    Quality = Enum.TryParse<OilQuality>(dto.OilInspection.Quality, true, out var qual) ? qual : null,
                    Level = Enum.TryParse<OilLevel>(dto.OilInspection.Level, true, out var lvl) ? lvl : null,
                    Complaint = dto.OilInspection.Complaint,
                    CompletedAt = DateTime.UtcNow,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
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
    Status = ServiceEnquiryStatus.Pending.ToString(),

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

[HttpGet("{id}")]
public async Task<ActionResult<ServiceEnquiryBasicResponseDto>> GetServiceEnquiry(Guid id)
{
    var enquiry = await _context.ServiceEnquiries
        .AsNoTracking() // performance: read-only, no tracking overhead
        .Where(e => e.Id == id)
        .Select(e => new ServiceEnquiryBasicResponseDto
        {
            Id = e.Id,

            // Customer
            CustomerName = e.CustomerName,
            CustomerPhone = e.CustomerPhone,
            CustomerAddress = e.CustomerAddress,
            CustomerCity = e.CustomerCity,
            PinCode = e.PinCode,

            // Vehicle
            VehicleName = e.VehicleName,
            VehicleNo = e.VehicleNo,
            Odometer = e.Odometer,
            Wheel = e.Wheel,
            VehicleType = e.VehicleType,

            // Service info
            ServiceDate = e.ServiceDate,
            Status = e.Status.ToString(),
            CreatedAt = e.CreatedAt,

            SelectedServices = e.SelectedServices
                .OrderBy(s => s.ExecutionOrder)
                .Select(s => new ServiceEnquiryServiceBasicResponseDto
                {
                    ServiceCode = s.Service.Code,     // e.g. "TYRE_INSPECT"
                    ServiceName = s.Service.Name      // e.g. "Tyre Inspection"
                })
                .ToList()
        })
        .FirstOrDefaultAsync();

    if (enquiry == null)
    {
        return NotFound();
    }

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

    // Normalize input: remove ALL common whitespace
    var normalizedVehicleNo = vehicleNo
        .Trim()
        .Replace(" ", "")
        .Replace("\u00A0", "") // non-breaking space
        .Replace("\t", "")
        .Replace("\n", "")
        .Replace("\r", "")
        .ToUpper();

    var recentEnquiries = await _context.ServiceEnquiries
        .AsNoTracking()
        .Where(e =>
            EF.Functions.ILike(
                e.VehicleNo
                    .Replace(" ", "")
                    .Replace("\u00A0", "")
                    .Replace("\t", "")
                    .Replace("\n", "")
                    .Replace("\r", "")
                    .ToUpper(),
                $"%{normalizedVehicleNo}%"
            )
        )
        .OrderByDescending(e => e.CreatedAt)
        .Take(take)
        .Select(e => new
        {
            EnquiryId = e.Id,
            VehicleNo = e.VehicleNo,
            CustomerName = e.CustomerName,
            Status = e.Status,
            CreatedAt = e.CreatedAt,
            ServiceDate = e.ServiceDate,
            Odometer = e.Odometer,
            SelectedServices = e.SelectedServices
                .Select(es => es.Service.Name)
                .ToList(),
            ComplaintNotes = e.ComplaintNotes
        })
        .ToListAsync();

    return Ok(recentEnquiries);
}
    // GET: api/service-enquiry

// Controllers/ServiceEnquiryController.cs

[HttpGet]

public async Task<ActionResult<PagedResult<ServiceEnquiryResponseDto>>> GetAllServiceEnquiries(
    [FromQuery] ServiceEnquiryFilterDto filter)
{
    // Start with base query
    IQueryable<ServiceEnquiry> query = _context.ServiceEnquiries
        .AsNoTracking()
        .Include(e => e.SelectedServices)
        .ThenInclude(es => es.Service);

    // Apply all filters using composition (extension method)
    query = query.ApplyFilter(filter);

    // Get total count before pagination
    int totalCount = await query.CountAsync();

    // Apply ordering & pagination
    var pagedItems = await query
        .OrderByDescending(e => e.CreatedAt)
        .Skip((filter.Page - 1) * filter.PageSize)
        .Take(filter.PageSize)
        .Select(e => new ServiceEnquiryResponseDto
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
            Status = e.Status.ToString(),
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt,
            ServiceWithNames = e.SelectedServices
                .Select(s => new ServiceWithNameDto
                {
                   Code = s.Service != null ? s.Service.Code : "Unknown",
                   Name  = s.Service != null ? s.Service.Name  : "Unknown Service"
                })
                .ToList()
        })
        .ToListAsync();

    var result = new PagedResult<ServiceEnquiryResponseDto>
    {
        Items = pagedItems,
        TotalCount = totalCount,
        Page = filter.Page,
        PageSize = filter.PageSize,
        TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
    };

    return Ok(result);
}

// ────────────────────────────────────────────────
// TYRE CHECKLIST - Upsert
// ────────────────────────────────────────────────
[HttpPut("{enquiryId}/checklists/tyre-technician-checklist")]
public async Task<IActionResult> UpsertTyreChecklist(
    Guid enquiryId,
    [FromBody] UpdateTyreChecklistDto dto)
{
    var enquiry = await _context.ServiceEnquiries
        .Include(e => e.TyreChecklist)
        .FirstOrDefaultAsync(e => e.Id == enquiryId);

    if (enquiry == null)
        return NotFound("Service enquiry not found");

    if (enquiry.TyreChecklist == null)
    {
        // CREATE
        var newRecord = new TyreChecklistRecord
        {
            Id = Guid.NewGuid(),
            ServiceEnquiryId = enquiryId,
            CorrectTyreSizeVerified = dto.CorrectTyreSizeVerified ?? false,
            NoBeadSidewallDamage = dto.NoBeadSidewallDamage ?? false,
            CorrectInflation = dto.CorrectInflation ?? false,
            WheelNutsTorqued = dto.WheelNutsTorqued ?? false,
            TechnicianNotes = dto.TechnicianNotes,
            CompletedAt = dto.CompletedAt ?? DateTime.UtcNow
        };

        enquiry.TyreChecklist = newRecord;
        _context.TyreChecklistRecords.Add(newRecord);

        await _context.SaveChangesAsync();
        return Created($"/api/service-enquiry/{enquiryId}/checklists/tyre-technician-checklist", null);
    }
    else
    {
        // UPDATE - partial
        if (dto.CorrectTyreSizeVerified.HasValue)
            enquiry.TyreChecklist.CorrectTyreSizeVerified = dto.CorrectTyreSizeVerified.Value;

        if (dto.NoBeadSidewallDamage.HasValue)
            enquiry.TyreChecklist.NoBeadSidewallDamage = dto.NoBeadSidewallDamage.Value;

        if (dto.CorrectInflation.HasValue)
            enquiry.TyreChecklist.CorrectInflation = dto.CorrectInflation.Value;

        if (dto.WheelNutsTorqued.HasValue)
            enquiry.TyreChecklist.WheelNutsTorqued = dto.WheelNutsTorqued.Value;

        if (dto.TechnicianNotes != null)
            enquiry.TyreChecklist.TechnicianNotes = dto.TechnicianNotes;

        if (dto.CompletedAt.HasValue)
            enquiry.TyreChecklist.CompletedAt = dto.CompletedAt.Value;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}

// ────────────────────────────────────────────────
// ALIGNMENT CHECKLIST - Upsert
// ────────────────────────────────────────────────
[HttpPut("{enquiryId}/checklists/alignment-technician-checklist")]
public async Task<IActionResult> UpsertAlignmentChecklist(
    Guid enquiryId,
    [FromBody] UpdateAlignmentChecklistDto dto)
{
    var enquiry = await _context.ServiceEnquiries
        .Include(e => e.AlignmentChecklist)
        .FirstOrDefaultAsync(e => e.Id == enquiryId);

    if (enquiry == null)
        return NotFound("Service enquiry not found");

    if (enquiry.AlignmentChecklist == null)
    {
        var newRecord = new AlignmentChecklistRecord
        {
            Id = Guid.NewGuid(),
            ServiceEnquiryId = enquiryId,
            SuspensionChecked = dto.SuspensionChecked ?? false,
            SteeringCentered = dto.SteeringCentered ?? false,
            BeforeAfterReportPrinted = dto.BeforeAfterReportPrinted ?? false,
            TechnicianNotes = dto.TechnicianNotes,
            CompletedAt = dto.CompletedAt ?? DateTime.UtcNow
        };

        enquiry.AlignmentChecklist = newRecord;
        _context.AlignmentChecklistRecords.Add(newRecord);

        await _context.SaveChangesAsync();
        return Created($"/api/service-enquiry/{enquiryId}/checklists/alignment-technician-checklist", null);
    }
    else
    {
        if (dto.SuspensionChecked.HasValue)
            enquiry.AlignmentChecklist.SuspensionChecked = dto.SuspensionChecked.Value;

        if (dto.SteeringCentered.HasValue)
            enquiry.AlignmentChecklist.SteeringCentered = dto.SteeringCentered.Value;

        if (dto.BeforeAfterReportPrinted.HasValue)
            enquiry.AlignmentChecklist.BeforeAfterReportPrinted = dto.BeforeAfterReportPrinted.Value;

        if (dto.TechnicianNotes != null)
            enquiry.AlignmentChecklist.TechnicianNotes = dto.TechnicianNotes;

        if (dto.CompletedAt.HasValue)
            enquiry.AlignmentChecklist.CompletedAt = dto.CompletedAt.Value;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}

// ────────────────────────────────────────────────
// BALANCING CHECKLIST - Upsert
// ────────────────────────────────────────────────
[HttpPut("{enquiryId}/checklists/balancing-technician-checklist")]
public async Task<IActionResult> UpsertBalancingChecklist(
    Guid enquiryId,
    [FromBody] UpdateBalancingChecklistDto dto)
{
    var enquiry = await _context.ServiceEnquiries
        .Include(e => e.BalancingChecklist)
        .FirstOrDefaultAsync(e => e.Id == enquiryId);

    if (enquiry == null)
        return NotFound("Service enquiry not found");

    if (enquiry.BalancingChecklist == null)
    {
        var newRecord = new BalancingChecklistRecord
        {
            Id = Guid.NewGuid(),
            ServiceEnquiryId = enquiryId,
            WheelCleaned = dto.WheelCleaned ?? false,
            WeightsFixedSecurely = dto.WeightsFixedSecurely ?? false,
            FinalRecheckDone = dto.FinalRecheckDone ?? false,
            TechnicianNotes = dto.TechnicianNotes,
            CompletedAt = dto.CompletedAt ?? DateTime.UtcNow
        };

        enquiry.BalancingChecklist = newRecord;
        _context.BalancingChecklistRecords.Add(newRecord);

        await _context.SaveChangesAsync();
        return Created($"/api/service-enquiry/{enquiryId}/checklists/balancing-technician-checklist", null);
    }
    else
    {
        if (dto.WheelCleaned.HasValue)
            enquiry.BalancingChecklist.WheelCleaned = dto.WheelCleaned.Value;

        if (dto.WeightsFixedSecurely.HasValue)
            enquiry.BalancingChecklist.WeightsFixedSecurely = dto.WeightsFixedSecurely.Value;

        if (dto.FinalRecheckDone.HasValue)
            enquiry.BalancingChecklist.FinalRecheckDone = dto.FinalRecheckDone.Value;

        if (dto.TechnicianNotes != null)
            enquiry.BalancingChecklist.TechnicianNotes = dto.TechnicianNotes;

        if (dto.CompletedAt.HasValue)
            enquiry.BalancingChecklist.CompletedAt = dto.CompletedAt.Value;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}

// ────────────────────────────────────────────────
// PUC CHECKLIST - Upsert
// ────────────────────────────────────────────────
[HttpPut("{enquiryId}/checklists/puc-operator-checklist")]
public async Task<IActionResult> UpsertPucChecklist(
    Guid enquiryId,
    [FromBody] UpdatePucChecklistDto dto)
{
    var enquiry = await _context.ServiceEnquiries
        .Include(e => e.PucChecklist)
        .FirstOrDefaultAsync(e => e.Id == enquiryId);

    if (enquiry == null)
        return NotFound("Service enquiry not found");

    if (enquiry.PucChecklist == null)
    {
        var newRecord = new PucChecklistRecord
        {
            Id = Guid.NewGuid(),
            ServiceEnquiryId = enquiryId,
            EngineWarmed = dto.EngineWarmed ?? false,
            ProbeInsertedCorrectly = dto.ProbeInsertedCorrectly ?? false,
            CertificatePrintedAndUploaded = dto.CertificatePrintedAndUploaded ?? false,
            TechnicianNotes = dto.TechnicianNotes,
            CompletedAt = dto.CompletedAt ?? DateTime.UtcNow
        };

        enquiry.PucChecklist = newRecord;
        _context.PucChecklistRecords.Add(newRecord);

        await _context.SaveChangesAsync();
        return Created($"/api/service-enquiry/{enquiryId}/checklists/puc-operator-checklist", null);
    }
    else
    {
        if (dto.EngineWarmed.HasValue)
            enquiry.PucChecklist.EngineWarmed = dto.EngineWarmed.Value;

        if (dto.ProbeInsertedCorrectly.HasValue)
            enquiry.PucChecklist.ProbeInsertedCorrectly = dto.ProbeInsertedCorrectly.Value;

        if (dto.CertificatePrintedAndUploaded.HasValue)
            enquiry.PucChecklist.CertificatePrintedAndUploaded = dto.CertificatePrintedAndUploaded.Value;

        if (dto.TechnicianNotes != null)
            enquiry.PucChecklist.TechnicianNotes = dto.TechnicianNotes;

        if (dto.CompletedAt.HasValue)
            enquiry.PucChecklist.CompletedAt = dto.CompletedAt.Value;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}

// ────────────────────────────────────────────────
// CAR WASH CHECKLIST - Upsert
// ────────────────────────────────────────────────
[HttpPut("{enquiryId}/checklists/car-wash-checklist")]
public async Task<IActionResult> UpsertCarWashChecklist(
    Guid enquiryId,
    [FromBody] UpdateCarWashChecklistDto dto)
{
    var enquiry = await _context.ServiceEnquiries
        .Include(e => e.CarWashChecklist)
        .FirstOrDefaultAsync(e => e.Id == enquiryId);

    if (enquiry == null)
        return NotFound("Service enquiry not found");

    if (enquiry.CarWashChecklist == null)
    {
        var newRecord = new CarWashChecklistRecord
        {
            Id = Guid.NewGuid(),
            ServiceEnquiryId = enquiryId,
            ExteriorWashed = dto.ExteriorWashed ?? false,
            InteriorVacuumed = dto.InteriorVacuumed ?? false,
            NoWaterOnEngineElectrics = dto.NoWaterOnEngineElectrics ?? false,
            TechnicianNotes = dto.TechnicianNotes,
            CompletedAt = dto.CompletedAt ?? DateTime.UtcNow
        };

        enquiry.CarWashChecklist = newRecord;
        _context.CarWashChecklistRecords.Add(newRecord);

        await _context.SaveChangesAsync();
        return Created($"/api/service-enquiry/{enquiryId}/checklists/car-wash-checklist", null);
    }
    else
    {
        if (dto.ExteriorWashed.HasValue)
            enquiry.CarWashChecklist.ExteriorWashed = dto.ExteriorWashed.Value;

        if (dto.InteriorVacuumed.HasValue)
            enquiry.CarWashChecklist.InteriorVacuumed = dto.InteriorVacuumed.Value;

        if (dto.NoWaterOnEngineElectrics.HasValue)
            enquiry.CarWashChecklist.NoWaterOnEngineElectrics = dto.NoWaterOnEngineElectrics.Value;

        if (dto.TechnicianNotes != null)
            enquiry.CarWashChecklist.TechnicianNotes = dto.TechnicianNotes;

        if (dto.CompletedAt.HasValue)
            enquiry.CarWashChecklist.CompletedAt = dto.CompletedAt.Value;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}


// GET: api/service-enquiry/{enquiryId}/checklists/tyre-technician-checklist
[HttpGet("{enquiryId}/checklists/tyre-technician-checklist")]
public async Task<IActionResult> GetTyreChecklist(Guid enquiryId)
{
    var checklist = await _context.TyreChecklistRecords
        .AsNoTracking()
        .FirstOrDefaultAsync(c => c.ServiceEnquiryId == enquiryId);

    if (checklist == null)
        return NotFound("Tyre checklist not updated");

    return Ok(checklist);
}

// GET: api/service-enquiry/{enquiryId}/checklists/alignment-technician-checklist
[HttpGet("{enquiryId}/checklists/alignment-technician-checklist")]
public async Task<IActionResult> GetAlignmentChecklist(Guid enquiryId)
{
    var checklist = await _context.AlignmentChecklistRecords
        .AsNoTracking()
        .FirstOrDefaultAsync(c => c.ServiceEnquiryId == enquiryId);

    if (checklist == null)
        return NotFound("Alignment checklist not updated");

    return Ok(checklist);
}

// GET: api/service-enquiry/{enquiryId}/checklists/balancing-technician-checklist
[HttpGet("{enquiryId}/checklists/balancing-technician-checklist")]
public async Task<IActionResult> GetBalancingChecklist(Guid enquiryId)
{
    var checklist = await _context.BalancingChecklistRecords
        .AsNoTracking()
        .FirstOrDefaultAsync(c => c.ServiceEnquiryId == enquiryId);

    if (checklist == null)
        return NotFound("Balancing checklist not updated");

    return Ok(checklist);
}

// GET: api/service-enquiry/{enquiryId}/checklists/puc-operator-checklist
[HttpGet("{enquiryId}/checklists/puc-operator-checklist")]
public async Task<IActionResult> GetPucChecklist(Guid enquiryId)
{
    var checklist = await _context.PucChecklistRecords
        .AsNoTracking()
        .FirstOrDefaultAsync(c => c.ServiceEnquiryId == enquiryId);

    if (checklist == null)
        return NotFound("PUC checklist not updated");

    return Ok(checklist);
}

// GET: api/service-enquiry/{enquiryId}/checklists/car-wash-checklist
[HttpGet("{enquiryId}/checklists/car-wash-checklist")]
public async Task<IActionResult> GetCarWashChecklist(Guid enquiryId)
{
    var checklist = await _context.CarWashChecklistRecords
        .AsNoTracking()
        .FirstOrDefaultAsync(c => c.ServiceEnquiryId == enquiryId);

    if (checklist == null)
        return NotFound("Car Wash checklist not updated");

    return Ok(checklist);
}

// In your InspectionsController or ServiceEnquiryController

[HttpGet("{id}/inspections/battery-check")]
public async Task<ActionResult<BatteryInspectionDto>> GetBatteryInspection(Guid id)
{
    var record = await _context.BatteryInspectionRecords
        .AsNoTracking()
        .FirstOrDefaultAsync(b => b.ServiceEnquiryId == id);

    if (record == null)
    {
        return NotFound();
    }

    var dto = new BatteryInspectionDto
    {
        Condition       = record.Condition?.ToString(),
        Voltage         = record.Voltage,
        SpecificGravity = record.SpecificGravity,
        Complaint       = record.Complaint,
        Notes           = record.Notes,
        CompletedAt     = record.CompletedAt
    };

    return Ok(dto);
}

[HttpGet("{id}/inspections/oil-check")]
public async Task<ActionResult<OilInspectionDto>> GetOilInspection(Guid id)
{
    var record = await _context.OilInspectionRecords
        .AsNoTracking()
        .FirstOrDefaultAsync(o => o.ServiceEnquiryId == id);

    if (record == null)
    {
        return NotFound();
    }

    var dto = new OilInspectionDto
    {
        Quality     = record.Quality?.ToString(),
        Level       = record.Level?.ToString(),
        Complaint   = record.Complaint,
        Notes       = record.Notes,
        CompletedAt = record.CompletedAt
    };

    return Ok(dto);
}

[HttpGet("{id}/inspections/tyre-rotation")]
public async Task<ActionResult<TyreRotationInspectionDto>> GetTyreRotationInspection(Guid id)
{
    var record = await _context.TyreRotationInspectionRecords
        .AsNoTracking()
        .FirstOrDefaultAsync(t => t.ServiceEnquiryId == id);

    if (record == null)
    {
        return NotFound();
    }

    var dto = new TyreRotationInspectionDto
    {
        RotationType = record.RotationType,
        Complaint    = record.Complaint,
        Notes        = record.Notes,
        CompletedAt  = record.CompletedAt
    };

    return Ok(dto);
}


[HttpPatch("{id}/complete")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> CompleteServiceEnquiry(Guid id)
{
    var userId = (Guid)HttpContext.Items["UserId"]!;
    var userRole = (RoleType)HttpContext.Items["UserRole"]!;

    if (userRole != RoleType.Admin)
        return StatusCode(403, new { message = "Only Admin can complete" });

var enquiry = await _context.ServiceEnquiries
    .Include(e => e.SelectedServices)           // ← add this
        .ThenInclude(ss => ss.Service)          // ← add this
    .Include(e => e.TyreChecklist)
    .Include(e => e.AlignmentChecklist)
    .Include(e => e.BalancingChecklist)
    .Include(e => e.PucChecklist)
    .Include(e => e.CarWashChecklist)
    .FirstOrDefaultAsync(e => e.Id == id);
    
    if (enquiry == null) return NotFound();
    if (enquiry.Status == ServiceEnquiryStatus.Completed) return Ok("Already completed");
    if (enquiry.Status != ServiceEnquiryStatus.Pending) return BadRequest("Only Pending allowed");

    var missing = new List<string>();

    // Helper: check if service is selected
    bool HasService(string code) => 
    enquiry.SelectedServices.Any(ss => ss.Service.Code == code);

    // Tyre (covers both inspection and rotation)
    if ((HasService("TYRE_INSPECT") || HasService("TYRE_ROT")) &&
        (enquiry.TyreChecklist == null || !ChecklistHelper.IsChecklistComplete(enquiry.TyreChecklist)))
    {
        missing.Add("Tyre Checklist " + (enquiry.TyreChecklist == null ? "(not created)" : "(incomplete)"));
    }

    // Alignment
    if (HasService("ALIGNMENT") &&
        (enquiry.AlignmentChecklist == null || !ChecklistHelper.IsChecklistComplete(enquiry.AlignmentChecklist)))
    {
        missing.Add("Alignment Checklist " + (enquiry.AlignmentChecklist == null ? "(not created)" : "(incomplete)"));
    }

    // Balancing
    if (HasService("BALANCING") &&
        (enquiry.BalancingChecklist == null || !ChecklistHelper.IsChecklistComplete(enquiry.BalancingChecklist)))
    {
        missing.Add("Balancing Checklist " + (enquiry.BalancingChecklist == null ? "(not created)" : "(incomplete)"));
    }

    // PUC
    if (HasService("PUC") &&
        (enquiry.PucChecklist == null || !ChecklistHelper.IsChecklistComplete(enquiry.PucChecklist)))
    {
        missing.Add("PUC Checklist " + (enquiry.PucChecklist == null ? "(not created)" : "(incomplete)"));
    }

    // Car Wash
    if (HasService("CAR_WASH") &&
        (enquiry.CarWashChecklist == null || !ChecklistHelper.IsChecklistComplete(enquiry.CarWashChecklist)))
    {
        missing.Add("Car Wash Checklist " + (enquiry.CarWashChecklist == null ? "(not created)" : "(incomplete)"));
    }

    if (missing.Any())
    {
        return BadRequest(new
        {
            message = "Cannot complete: Required checklists missing or incomplete",
            missingChecklists = missing
        });
    }

    // Complete
    enquiry.Status = ServiceEnquiryStatus.Completed;
    enquiry.UpdatedBy = userId;
    enquiry.UpdatedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Completed successfully",
        enquiryId = enquiry.Id,
        completedAt = enquiry.UpdatedAt
    });
}

[HttpGet("my-enquiries")]
[Authorize]
public async Task<IActionResult> GetMyEnquiriesByDesignations()
{
    if (!HttpContext.Items.TryGetValue("UserId", out var userIdObj) ||
        userIdObj is not Guid userId)
    {
        return Unauthorized(new { message = "User not authenticated" });
    }

    var user = await _context.Users
        .AsNoTracking()
        .Include(u => u.UserDesignations)
        .FirstOrDefaultAsync(u => u.Id == userId);

    if (user == null)
    {
        return NotFound(new { message = "User not found" });
    }

    var userDesignationIds = user.UserDesignations
        .Select(ud => ud.DesignationId)
        .Distinct()
        .ToList();

    if (userDesignationIds.Count == 0)
    {
        return Ok(new List<object>());
    }

    // ── FIXED PART ────────────────────────────────────────────────
    var designationServiceIds = await _context.Designations
        .Where(d => userDesignationIds.Contains(d.Id))
        .Select(d => d.ServiceId)
        .Where(id => id.HasValue)
        .Select(id => id.Value)
        .Distinct()
        .ToListAsync();
    // ──────────────────────────────────────────────────────────────

    if (designationServiceIds.Count == 0)
    {
        return Ok(new List<object>());
    }

    var enquiries = await _context.ServiceEnquiries
        .Include(e => e.SelectedServices)
            .ThenInclude(ss => ss.Service)
            .Where(e => e.Status == ServiceEnquiryStatus.Pending)
        .Where(e => e.SelectedServices.Any(ss => designationServiceIds.Contains(ss.ServiceId)))
        .Select(e => new
        {
            e.Id,
            e.CustomerName,
            e.CustomerPhone,
            e.VehicleNo,
            e.VehicleName,
            e.Status,
            e.CreatedAt,
            e.ServiceDate,
            e.Odometer,
            Services = e.SelectedServices.Select(ss => new
            {
                ServiceId   = ss.ServiceId,
                ServiceName = ss.Service.Name,
                ServiceCode = ss.Service.Code
            }).ToList()
        })
        .OrderByDescending(e => e.CreatedAt)
        .ToListAsync();

    return Ok(enquiries);
}

}