using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.ServiceManagement;
using backend.Dtos.ServiceManagement; // ← you'll create these DTOs

namespace backend.Controllers;

[ApiController]
[Route("api/services")]
public class ServiceController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    // GET: api/services → list all active services
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Service>>> GetServices()
    {
        var services = await _context.Services
            .Where(s => s.IsActive)
            .OrderBy(s => s.Name)
            .ToListAsync();

        return Ok(services);
    }

    // GET: api/services/{id} → get single service by ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Service>> GetService(Guid id)
    {
        var service = await _context.Services.FindAsync(id);

        if (service == null)
            return NotFound();

        return Ok(service);
    }

    // POST: api/services → create new service
    [HttpPost]
    public async Task<ActionResult<Service>> CreateService([FromBody] CreateServiceDto dto)
    {
        // Basic validation
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Name is required");

        if (string.IsNullOrWhiteSpace(dto.Code))
            return BadRequest("Code is required");

        // Check for duplicate code
        if (await _context.Services.AnyAsync(s => s.Code == dto.Code))
            return BadRequest("Service code already exists");

        var service = new Service
        {
            Name        = dto.Name.Trim(),
            Code        = dto.Code.Trim().ToUpperInvariant(),
            Description = dto.Description?.Trim(),
            Category    = dto.Category?.Trim(),
            Image       = dto.Image?.Trim(),
            IsActive    = true,
            CreatedAt   = DateTime.UtcNow
        };

        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetService), new { id = service.Id }, service);
    }

    // PUT: api/services/{id} → update existing service
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateService(Guid id, [FromBody] UpdateServiceDto dto)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null)
            return NotFound();

        // Update only provided fields
        if (!string.IsNullOrWhiteSpace(dto.Name))
            service.Name = dto.Name.Trim();

        if (!string.IsNullOrWhiteSpace(dto.Code))
        {
            // Check if new code is taken by another service
            if (await _context.Services.AnyAsync(s => s.Code == dto.Code && s.Id != id))
                return BadRequest("Service code already exists");

            service.Code = dto.Code.Trim().ToUpperInvariant();
        }

        if (dto.Description != null)
            service.Description = dto.Description.Trim();

        if (dto.Category != null)
            service.Category = dto.Category.Trim();

        if (dto.Image != null)
            service.Image = dto.Image.Trim();

        if (dto.IsActive.HasValue)
            service.IsActive = dto.IsActive.Value;

        service.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/services/{id} → soft-delete (set IsActive = false)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteService(Guid id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null)
            return NotFound();

        service.IsActive = false;
        service.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

}