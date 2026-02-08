using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models.auth;
using backend.Dtos.User;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/users")]
[Authorize] // All endpoints require authentication
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/users — List all users (Admin only)
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<object>>> GetUsers()
    {
        var users = await _context.Users
            .AsNoTracking()
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.Role,
                u.EmployeeId,
                u.CreatedAt,
                DesignationCount = u.UserDesignations.Count
            })
            .OrderBy(u => u.Username)
            .ToListAsync();
        return Ok(users);
    }

    // GET /api/users/me — Get current authenticated user's details (including designations)
    [HttpGet("me")]
    public async Task<ActionResult<object>> GetCurrentUser()
    {
        var userId = (Guid)HttpContext.Items["UserId"]!;

        var user = await _context.Users
            .AsNoTracking()
            .Include(u => u.UserDesignations)
                .ThenInclude(ud => ud.Designation)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return NotFound(new { message = "User not found" });

        var response = new
        {
            user.Id,
            user.Username,
            user.Email,
            user.Role,
            user.EmployeeId,
            user.CreatedAt,
            Designations = user.UserDesignations.Select(ud => new
            {
                DesignationId = ud.DesignationId,
                DesignationName = ud.Designation.Name,
                DesignationCode = ud.Designation.Code,
                AssignedAt = ud.AssignedAt
            })
        };

        return Ok(response);
    }

    // PATCH /api/users/designations — Update designations for the CURRENT logged-in user
    [HttpPatch("designations")]
    public async Task<IActionResult> UpdateMyDesignations([FromBody] UpdateUserDesignationsDto dto)
    {
        // 1. Get the current authenticated user's ID (from your filter)
        if (!HttpContext.Items.TryGetValue("UserId", out var userIdObj) ||
            userIdObj is not Guid userId)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        // 2. Find the current user
        var user = await _context.Users
            .Include(u => u.UserDesignations)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return NotFound(new { message = "User not found" });

        // 3. Validate all requested designation IDs exist
        var requestedIds = dto.DesignationIds?.Distinct().ToList() ?? new List<Guid>();

        var validIds = await _context.Designations
            .Where(d => requestedIds.Contains(d.Id))
            .Select(d => d.Id)
            .ToListAsync();

        var invalidIds = requestedIds.Except(validIds).ToList();

        if (invalidIds.Any())
        {
            return BadRequest(new
            {
                message = "One or more designation IDs do not exist",
                invalidIds
            });
        }

        // 4. Replace designations for the current user
        user.UserDesignations.Clear();

        foreach (var designationId in requestedIds)
        {
            user.UserDesignations.Add(new UserDesignation
            {
                UserId = userId,
                DesignationId = designationId,
                AssignedAt = DateTime.UtcNow,
                AssignedById = userId  // current user assigned it to themselves
            });
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Your designations updated successfully",
            designationCount = requestedIds.Count
        });
    }

    // Optional: GET /api/users/designations — Get current user's designations
    [HttpGet("designations")]
    public async Task<ActionResult<IEnumerable<object>>> GetMyDesignations()
    {
        var userId = (Guid)HttpContext.Items["UserId"]!;

        var designations = await _context.UserDesignations
            .Where(ud => ud.UserId == userId)
            .Include(ud => ud.Designation)
            .Select(ud => new
            {
                DesignationId = ud.DesignationId,
                DesignationName = ud.Designation.Name,
                DesignationCode = ud.Designation.Code,
                AssignedAt = ud.AssignedAt
            })
            .ToListAsync();

        return Ok(designations);
    }

    /// <summary>
/// Get current authenticated user's basic profile + list of assigned designation names
/// </summary>
    [HttpGet("me/profile")]
    [Authorize]
    public async Task<IActionResult> GetMyProfile()
    {
        // Get current user ID from auth filter
        if (!HttpContext.Items.TryGetValue("UserId", out var userIdObj) ||
            userIdObj is not Guid userId)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var user = await _context.Users
            .AsNoTracking()
            .Include(u => u.UserDesignations)
                .ThenInclude(ud => ud.Designation)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return NotFound(new { message = "User not found" });

        var response = new
        {
            id = user.Id,
            name = user.Username,           // or FullName if you add it later
            email = user.Email,
            role = user.Role.ToString(),
            employeeId = user.EmployeeId,
            createdAt = user.CreatedAt,
            designations = user.UserDesignations
                .Select(ud => ud.Designation.Name)
                .Where(name => !string.IsNullOrEmpty(name))
                .ToList()
        };

        return Ok(response);
    }

    /// <summary>
/// Get total service enquiries created by the current user + 3 most recent ones
/// </summary>
[HttpGet("me/enquiries")]
[Authorize]
public async Task<IActionResult> GetMyEnquiriesSummary()
{
    // Get current user ID from auth filter
    if (!HttpContext.Items.TryGetValue("UserId", out var userIdObj) ||
        userIdObj is not Guid userId)
    {
        return Unauthorized(new { message = "User not authenticated" });
    }

    // Total count
    var totalEnquiries = await _context.ServiceEnquiries
        .CountAsync(e => e.CreatedBy == userId); // assuming you have CreatedBy on ServiceEnquiry

    // Last 3 enquiries (newest first)
    var recentEnquiries = await _context.ServiceEnquiries
        .Where(e => e.CreatedBy == userId)
        .OrderByDescending(e => e.CreatedAt)
        .Take(3)
        .Select(e => new
        {
            e.Id,
            e.VehicleNo,
            e.CustomerName,
            e.Status,
            e.CreatedAt,
            e.ServiceDate,
            ServiceCount = e.SelectedServices.Count,
            Odometer = e.Odometer
        })
        .ToListAsync();

    var response = new
    {
        totalEnquiries,
        recent = recentEnquiries
    };

    return Ok(response);
}
}