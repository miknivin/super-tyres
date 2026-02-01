namespace backend.Dtos.Designations;
public class DesignationResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty; // flatten instead of full object
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}