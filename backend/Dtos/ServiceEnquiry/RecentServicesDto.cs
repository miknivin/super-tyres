namespace backend.Dtos.Operations;

public class RecentServiceDto
{
    public Guid EnquiryId { get; set; }
    public string VehicleNo { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ServiceDate { get; set; }
    public string? Odometer { get; set; }
    public List<string> SelectedServices { get; set; } = new();
    public string? ComplaintNotes { get; set; }
}