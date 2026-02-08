// src/Dtos/ServiceEnquiry/EnquiriesByDesignationsRequest.cs
namespace backend.Dtos.ServiceEnquiry;

public class EnquiriesByDesignationsRequest
{
    public List<Guid> DesignationIds { get; set; } = new();
}