using backend.Dtos.ServiceEnquiry;
using backend.Models.Operations;

namespace backend.Extensions
{
    public static class ServiceEnquiryQueryExtensions
    {
        public static IQueryable<ServiceEnquiry> ApplyFilter(
            this IQueryable<ServiceEnquiry> query,
            ServiceEnquiryFilterDto filter)
        {
            // 1. Keyword search
            if (!string.IsNullOrWhiteSpace(filter.Keyword))
            {
                var kw = filter.Keyword.Trim().ToLowerInvariant();
                query = query.Where(e =>
                    e.VehicleNo.ToLower().Contains(kw) ||
                    e.CustomerName.ToLower().Contains(kw) ||
                    e.CustomerPhone.ToLower().Contains(kw) ||
                    e.CustomerCity.ToLower().Contains(kw) ||
                    e.PinCode.ToLower().Contains(kw)
                );
            }

            // 2. Created date range (robust)
            if (filter.CreatedFrom.HasValue)
    {
        // Start of the "from" day (00:00:00)
        var start = filter.CreatedFrom.Value.Date;
        query = query.Where(e => e.CreatedAt >= start);
    }

    if (filter.CreatedTo.HasValue)
    {
        // End of the "to" day (23:59:59.9999999) – inclusive
        var end = filter.CreatedTo.Value.Date.AddDays(1).AddTicks(-1);
        query = query.Where(e => e.CreatedAt <= end);
    }

    // Same logic for UpdatedAt range
    if (filter.UpdatedFrom.HasValue)
    {
        var start = filter.UpdatedFrom.Value.Date;
        query = query.Where(e => e.UpdatedAt >= start);
    }

    if (filter.UpdatedTo.HasValue)
    {
        var end = filter.UpdatedTo.Value.Date.AddDays(1).AddTicks(-1);
        query = query.Where(e => e.UpdatedAt <= end);
    }

            // 4. Odometer range
            if (filter.MinOdometer.HasValue)
                query = query.Where(e => e.Odometer >= filter.MinOdometer.Value);

            if (filter.MaxOdometer.HasValue)
                query = query.Where(e => e.Odometer <= filter.MaxOdometer.Value);

            // 5. Services
            if (filter.ServiceIds is { Count: > 0 })
            {
                query = query.Where(e =>
                    e.SelectedServices.Any(ss =>
                        filter.ServiceIds.Contains(ss.ServiceId)));
            }

            // 6. Status
            if (!string.IsNullOrWhiteSpace(filter.Status))
            {
                if (Enum.TryParse<ServiceEnquiryStatus>(
                    filter.Status.Trim(),
                    true,
                    out var statusEnum))
                {
                    query = query.Where(e => e.Status == statusEnum);
                }
            }

            return query;
        }
    }
}
