using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Dtos;
using backend.Dtos.Designations;

namespace backend.Controllers;

[ApiController]
[Route("api/designations")]
public class DesignationController : ControllerBase
{
    private readonly AppDbContext _context;

    public DesignationController(AppDbContext context)
    {
        _context = context;
    }

  [HttpGet]
public async Task<ActionResult<IEnumerable<DesignationResponseDto>>> GetDesignations()
{
    var designations = await _context.Designations
        .Where(d => d.IsActive)
        .Select(d => new DesignationResponseDto
        {
            Id = d.Id,
            Name = d.Name,
            Code = d.Code,
            Description = d.Description,
            ServiceId = d.ServiceId,
            ServiceName = d.Service != null ? d.Service.Name : null,
            IsActive = d.IsActive,
            CreatedAt = d.CreatedAt,
            UpdatedAt = d.UpdatedAt
        })
        .OrderBy(d => d.Name)
        .ToListAsync();

    return Ok(designations);
}

   [HttpGet("{id}")]
    public async Task<ActionResult<DesignationResponseDto>> GetDesignation(Guid id)
    {
        var designation = await _context.Designations
            .Include(d => d.Service)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (designation == null)
            return NotFound();

        var dto = new DesignationResponseDto
        {
            Id = designation.Id,
            Name = designation.Name,
            Code = designation.Code,
            Description = designation.Description,
            ServiceId = designation.ServiceId,
            ServiceName = designation.Service?.Name,
            IsActive = designation.IsActive,
            CreatedAt = designation.CreatedAt,
            UpdatedAt = designation.UpdatedAt
        };

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<Designation>> CreateDesignation([FromBody] CreateDesignationDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (await _context.Designations.AnyAsync(d => d.Code == dto.Code))
            return BadRequest("Designation code already exists");

        var designation = new Designation
        {
            Name = dto.Name.Trim(),
            Code = dto.Code.Trim().ToUpperInvariant(),
            Description = dto.Description?.Trim(),
            ServiceId = dto.ServiceId
        };

        _context.Designations.Add(designation);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDesignation), new { id = designation.Id }, designation);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDesignation(Guid id, [FromBody] UpdateDesignationDto dto)
    {
        var designation = await _context.Designations.FindAsync(id);
        if (designation == null)
            return NotFound();

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (dto.Name != null)
            designation.Name = dto.Name.Trim();

        if (dto.Code != null)
        {
            if (await _context.Designations.AnyAsync(d => d.Code == dto.Code && d.Id != id))
                return BadRequest("Designation code already exists");

            designation.Code = dto.Code.Trim().ToUpperInvariant();
        }

        if (dto.Description != null)
            designation.Description = dto.Description?.Trim();

        if (dto.ServiceId != null)
            designation.ServiceId = dto.ServiceId;

        if (dto.IsActive.HasValue)
            designation.IsActive = dto.IsActive.Value;

        designation.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDesignation(Guid id)
    {
        var designation = await _context.Designations.FindAsync(id);
        if (designation == null)
            return NotFound();

        designation.IsActive = false;
        designation.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}