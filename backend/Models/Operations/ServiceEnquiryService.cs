using backend.Models.ServiceManagement;

namespace backend.Models.Operations;


public class ServiceEnquiryService
{

    public Guid ServiceEnquiryId { get; set; }

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

    /// <summary>
    /// When this service entry was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// When this service entry was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}