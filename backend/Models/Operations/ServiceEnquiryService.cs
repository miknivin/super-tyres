using System.Text.Json.Serialization;
using backend.Models.ServiceManagement;

namespace backend.Models.Operations;


public class ServiceEnquiryService
{

    public Guid ServiceEnquiryId { get; set; }
    [JsonIgnore]
    public ServiceEnquiry ServiceEnquiry { get; set; } = null!;

    public Guid ServiceId { get; set; }

    public Service Service { get; set; } = null!;

    public int ExecutionOrder { get; set; } = 0;

    public int? EstimatedMinutes { get; set; }

    public int? ActualMinutes { get; set; }

    /// <summary>
    /// Optional: price charged for this service on this job card
    /// (can be different from master service price due to discounts, etc.)
    /// </summary>
    public decimal? PriceCharged { get; set; }

    /// <summary>
    /// Optional: any service-specific notes for this job card
    /// </summary>
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}