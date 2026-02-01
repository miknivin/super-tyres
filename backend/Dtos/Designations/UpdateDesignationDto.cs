using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public class UpdateDesignationDto
{
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be 2–100 characters")]
    public string? Name { get; set; }

    [StringLength(50, MinimumLength = 2, ErrorMessage = "Code must be 2–50 characters")]
    public string? Code { get; set; }

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }

    public Guid? ServiceId { get; set; }

    public bool? IsActive { get; set; }
}