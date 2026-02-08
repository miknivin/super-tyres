namespace backend.Dtos;

public class ServiceEnquiryBasicResponseDto
{
    public Guid Id { get; set; }

    // Customer
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerAddress { get; set; }
    public string? CustomerCity { get; set; }
    public string? PinCode { get; set; }

    // Vehicle
    public string VehicleName { get; set; } = string.Empty;
    public string VehicleNo { get; set; } = string.Empty;
    public int Odometer { get; set; }
    public string Wheel { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;

    // Optional useful fields (still minimal)
    public DateTime? ServiceDate { get; set; }
    public string Status { get; set; } = string.Empty;
   public List<ServiceEnquiryServiceBasicResponseDto> SelectedServices { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class ServiceEnquiryServiceBasicResponseDto
{
    public string ServiceCode { get; set; } = string.Empty;   // e.g. "TYRE_INSPECT"
    public string ServiceName { get; set; } = string.Empty;   // e.g. "Tyre Inspection"
}