// src/Dtos/User/UpdateUserDesignationsDto.cs
namespace backend.Dtos.User;

public class UpdateUserDesignationsDto
{
 
    public List<Guid> DesignationIds { get; set; } = new List<Guid>();
}