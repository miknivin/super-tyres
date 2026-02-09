// Dtos/ServiceEnquiry/ServiceEnquiryFilterDto.cs
namespace backend.Dtos.ServiceEnquiry;

public class ServiceEnquiryFilterDto
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Keyword { get; set; }
    public DateTime? CreatedFrom { get; set; }
    public DateTime? CreatedTo { get; set; }
    public DateTime? UpdatedFrom { get; set; }
    public DateTime? UpdatedTo { get; set; }
    public int? MinOdometer { get; set; }
    public int? MaxOdometer { get; set; }
    public string? Status { get; set; }
    public List<Guid>? ServiceIds { get; set; }
}