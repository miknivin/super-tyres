namespace backend.Dtos.ServiceManagement;

public class UpdateServiceDto
{
    public string? Name { get; set; }
    public string? Code { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Image { get; set; }
    public bool? IsActive { get; set; }
}