// src/Dtos/User/UserDesignationResponseDto.cs
namespace backend.Dtos.User;

public class UserDesignationResponseDto
{
    public Guid DesignationId { get; set; }
    
    public string DesignationName { get; set; } = string.Empty;
    
    public string DesignationCode { get; set; } = string.Empty;
    
    public DateTime AssignedAt { get; set; }
    
    // Optional: if you want to include who assigned it
    public Guid? AssignedBy { get; set; }
    
    public string? AssignedByUsername { get; set; }
}