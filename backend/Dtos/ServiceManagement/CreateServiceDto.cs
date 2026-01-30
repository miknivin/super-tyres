namespace backend.Dtos.ServiceManagement;

public class CreateServiceDto
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Image { get; set; }
}