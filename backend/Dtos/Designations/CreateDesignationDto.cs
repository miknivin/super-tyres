using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public class CreateDesignationDto
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be 2–100 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Code is required")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Code must be 2–50 characters")]
    public string Code { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }

    public Guid? ServiceId { get; set; }
}