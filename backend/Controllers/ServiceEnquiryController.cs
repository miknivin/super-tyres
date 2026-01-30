using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.Operations;
using backend.Dtos.ServiceEnquiry;

namespace backend.Controllers;

[ApiController]
[Route("api/service-enquiry")]
public class ServiceEnquiryController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    // POST: Create new ServiceEnquiry + selected services + inspection data
    // POST: Create new ServiceEnquiry + selected services + all inspection data
    [HttpPost]
public async Task<IActionResult> CreateServiceEnquiry([FromBody] CreateServiceEnquiryDto dto)
{
    // 1. Create main enquiry
    var enquiry = new ServiceEnquiry
    {
        CustomerName    = dto.CustomerName,
        CustomerPhone   = dto.CustomerPhone,
        CustomerAddress = dto.CustomerAddress,
        CustomerCity    = dto.CustomerCity,
        PinCode         = dto.PinCode,
        VehicleName     = dto.VehicleName,
        VehicleNo       = dto.VehicleNo,
        Odometer        = dto.Odometer,
        Wheel           = dto.Wheel,
        VehicleType     = dto.VehicleType,
        ServiceDate     = dto.ServiceDate,
        ComplaintNotes  = dto.ComplaintNotes,
        Status          = "Pending"
    };

    _context.ServiceEnquiries.Add(enquiry);
    await _context.SaveChangesAsync(); // Save once to get enquiry.Id

    // 2. Parallel lookup of all selected services
    var serviceLookupTasks = dto.SelectedServices.Select(async code =>
    {
        var service = await _context.Services
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Code == code);

        if (service == null)
            throw new KeyNotFoundException($"Service code not found: {code}");

        return new ServiceEnquiryService
        {
            ServiceEnquiryId = enquiry.Id,
            ServiceId        = service.Id,
            ExecutionOrder   = 0 // can be updated later if needed
        };
    }).ToArray();

    ServiceEnquiryService[] serviceEnquiryServices;
    try
    {
        serviceEnquiryServices = await Task.WhenAll(serviceLookupTasks);
    }
    catch (KeyNotFoundException ex)
    {
        return BadRequest(ex.Message);
    }

    _context.ServiceEnquiryServices.AddRange(serviceEnquiryServices);

    // 3. Conditionally create inspection records in parallel
    var inspectionTasks = new List<Task>();

    // Tyre Inspection
    if (dto.TyreInspection != null &&
        (dto.SelectedServices.Contains("TYRE_INSPECT") || dto.SelectedServices.Contains("TYRE_ROT")))
    {
        inspectionTasks.Add(Task.Run(() =>
        {
            _context.TyreInspectionRecords.Add(new TyreInspectionRecord
            {
                ServiceEnquiryId   = enquiry.Id,
                SelectedTyre       = Enum.TryParse<TyrePosition>(dto.TyreInspection.SelectedTyre, true, out var pos) ? pos : null,
                FrontLeft          = dto.TyreInspection.FrontLeft != null ? new TyreValues { TreadDepth = dto.TyreInspection.FrontLeft.TreadDepth, TyrePressure = dto.TyreInspection.FrontLeft.TyrePressure } : null,
                FrontRight         = dto.TyreInspection.FrontRight != null ? new TyreValues { TreadDepth = dto.TyreInspection.FrontRight.TreadDepth, TyrePressure = dto.TyreInspection.FrontRight.TyrePressure } : null,
                RearLeft           = dto.TyreInspection.RearLeft != null ? new TyreValues { TreadDepth = dto.TyreInspection.RearLeft.TreadDepth, TyrePressure = dto.TyreInspection.RearLeft.TyrePressure } : null,
                RearRight          = dto.TyreInspection.RearRight != null ? new TyreValues { TreadDepth = dto.TyreInspection.RearRight.TreadDepth, TyrePressure = dto.TyreInspection.RearRight.TyrePressure } : null,
                SelectedComplaints = dto.TyreInspection.SelectedComplaints,
                CustomComplaint    = dto.TyreInspection.CustomComplaint,
                RotationType       = dto.TyreInspection.RotationType,
                RotationComplaint  = dto.TyreInspection.RotationComplaint,
                CompletedAt        = DateTime.UtcNow
            });
        }));
    }

    // Tyre Rotation (separate inspection – no checklist)
    if (dto.TyreRotationInspection != null && dto.SelectedServices.Contains("TYRE_ROT"))
    {
        inspectionTasks.Add(Task.Run(() =>
        {
            _context.TyreRotationInspectionRecords.Add(new TyreRotationInspectionRecord
            {
                ServiceEnquiryId = enquiry.Id,
                RotationType     = dto.TyreRotationInspection.RotationType ,
                Complaint        = dto.TyreRotationInspection.Complaint,
                CompletedAt      = DateTime.UtcNow
            });
        }));
    }

    // Alignment Inspection
    if (dto.AlignmentInspection != null && dto.SelectedServices.Contains("ALIGNMENT"))
    {
        inspectionTasks.Add(Task.Run(() =>
        {
            _context.AlignmentInspectionRecords.Add(new AlignmentInspectionRecord
            {
                ServiceEnquiryId   = enquiry.Id,
                LastServiceDate    = dto.AlignmentInspection.LastServiceDate,
                Complaint          = dto.AlignmentInspection.Complaint,
                InflationPressure  = dto.AlignmentInspection.InflationPressure,
                CompletedAt        = DateTime.UtcNow
            });
        }));
    }

    // Balancing Inspection
    if (dto.BalancingInspection != null && dto.SelectedServices.Contains("BALANCING"))
    {
        inspectionTasks.Add(Task.Run(() =>
        {
            _context.BalancingInspectionRecords.Add(new BalancingInspectionRecord
            {
                ServiceEnquiryId   = enquiry.Id,
                FrontLeftWeight    = dto.BalancingInspection.FrontLeftWeight,
                FrontRightWeight   = dto.BalancingInspection.FrontRightWeight,
                RearLeftWeight     = dto.BalancingInspection.RearLeftWeight,
                RearRightWeight    = dto.BalancingInspection.RearRightWeight,
                Complaint          = dto.BalancingInspection.Complaint,
                CompletedAt        = DateTime.UtcNow
            });
        }));
    }

    // PUC Inspection
    if (dto.PucInspection != null && dto.SelectedServices.Contains("PUC"))
    {
        inspectionTasks.Add(Task.Run(() =>
        {
            _context.PucInspectionRecords.Add(new PucInspectionRecord
            {
                ServiceEnquiryId       = enquiry.Id,
                NormalPUC              = dto.PucInspection.NormalPUC,
                EngineWarmUp           = dto.PucInspection.EngineWarmUp,
                HighRPM                = dto.PucInspection.HighRPM,
                IdleRPM                = dto.PucInspection.IdleRPM,
                CertificatePrint       = dto.PucInspection.CertificatePrint,
                FuelType               = dto.PucInspection.FuelType,
                CompletedAt            = DateTime.UtcNow
            });
        }));
    }

    // Car Wash Inspection
    if (dto.CarWashInspection != null && dto.SelectedServices.Contains("CAR_WASH"))
    {
        inspectionTasks.Add(Task.Run(() =>
        {
            _context.CarWashInspectionRecords.Add(new CarWashInspectionRecord
            {
                ServiceEnquiryId   = enquiry.Id,
                SelectedServices   = dto.CarWashInspection.SelectedServices,
                Complaint          = dto.CarWashInspection.Complaint,
                CompletedAt        = DateTime.UtcNow
            });
        }));
    }

    // Battery Inspection
    if (dto.BatteryInspection != null && dto.SelectedServices.Contains("BATTERY_CHECK"))
    {
        inspectionTasks.Add(Task.Run(() =>
        {
            _context.BatteryInspectionRecords.Add(new BatteryInspectionRecord
            {
                ServiceEnquiryId   = enquiry.Id,
                Condition          = Enum.TryParse<BatteryCondition>(dto.BatteryInspection.Condition, true, out var cond) ? cond : null,
                Voltage            = dto.BatteryInspection.Voltage,
                SpecificGravity    = dto.BatteryInspection.SpecificGravity,
                Complaint          = dto.BatteryInspection.Complaint,
                CompletedAt        = DateTime.UtcNow
            });
        }));
    }

    // Oil Inspection
    if (dto.OilInspection != null && dto.SelectedServices.Contains("OIL_CHECK"))
    {
        inspectionTasks.Add(Task.Run(() =>
        {
            _context.OilInspectionRecords.Add(new OilInspectionRecord
            {
                ServiceEnquiryId   = enquiry.Id,
                Quality            = Enum.TryParse<OilQuality>(dto.OilInspection.Quality, true, out var qual) ? qual : null,
                Level              = Enum.TryParse<OilLevel>(dto.OilInspection.Level, true, out var lvl) ? lvl : null,
                Complaint          = dto.OilInspection.Complaint,
                CompletedAt        = DateTime.UtcNow
            });
        }));
    }

    // Wait for all inspection creations
    await Task.WhenAll(inspectionTasks);

    // Final save – everything in one transaction
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetServiceEnquiry), new { id = enquiry.Id }, enquiry);
}
    // PUT: Update checklist only (technician fills yes/no later)
    [HttpPut("{id}/checklist")]
    public async Task<IActionResult> UpdateChecklist(Guid id, [FromBody] UpdateChecklistDto dto)
    {
        var enquiry = await _context.ServiceEnquiries.FindAsync(id);
        if (enquiry == null) return NotFound();

        if (dto.TyreChecklist != null)
        {
            var checklist = await _context.TyreChecklistRecords
                .FirstOrDefaultAsync(c => c.ServiceEnquiryId == id);

            if (checklist == null)
            {
                checklist = new TyreChecklistRecord { ServiceEnquiryId = id };
                _context.TyreChecklistRecords.Add(checklist);
            }

            checklist.CorrectTyreSizeVerified = dto.TyreChecklist.CorrectTyreSizeVerified;
            checklist.NoBeadSidewallDamage = dto.TyreChecklist.NoBeadSidewallDamage;
            checklist.CorrectInflation = dto.TyreChecklist.CorrectInflation;
            checklist.WheelNutsTorqued = dto.TyreChecklist.WheelNutsTorqued;
            checklist.TechnicianNotes = dto.TyreChecklist.TechnicianNotes;
            checklist.CompletedAt = DateTime.UtcNow;
        }

        // Repeat similar logic for other checklists (Alignment, Balancing, PUC, CarWash)

        await _context.SaveChangesAsync();
        return NoContent();
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
}