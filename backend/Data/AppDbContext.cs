using Microsoft.EntityFrameworkCore;
using backend.Models.auth;
using backend.Models.ServiceManagement;
using backend.Models.Operations;
using backend.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace backend.Data;

public class AppDbContext : DbContext
{
    // Auth
    public DbSet<User> Users { get; set; } = null!;

    // Service Management (admin-maintained master services)
    public DbSet<Service> Services { get; set; } = null!;

    // Operations (job cards & inspections)
    public DbSet<ServiceEnquiry> ServiceEnquiries { get; set; } = null!;
    public DbSet<ServiceEnquiryService> ServiceEnquiryServices { get; set; } = null!;

    // Fixed checklist records (yes/no from paper forms)
    public DbSet<TyreChecklistRecord> TyreChecklistRecords { get; set; } = null!;
    public DbSet<AlignmentChecklistRecord> AlignmentChecklistRecords { get; set; } = null!;
    public DbSet<BalancingChecklistRecord> BalancingChecklistRecords { get; set; } = null!;
    public DbSet<PucChecklistRecord> PucChecklistRecords { get; set; } = null!;
    public DbSet<CarWashChecklistRecord> CarWashChecklistRecords { get; set; } = null!;

    // Inspection-only records (detailed data from Redux/forms)
    public DbSet<TyreInspectionRecord> TyreInspectionRecords { get; set; } = null!;
    public DbSet<TyreRotationInspectionRecord> TyreRotationInspectionRecords { get; set; } = null!;
    public DbSet<AlignmentInspectionRecord> AlignmentInspectionRecords { get; set; } = null!;
    public DbSet<BalancingInspectionRecord> BalancingInspectionRecords { get; set; } = null!;
    public DbSet<PucInspectionRecord> PucInspectionRecords { get; set; } = null!;
    public DbSet<CarWashInspectionRecord> CarWashInspectionRecords { get; set; } = null!;
    public DbSet<BatteryInspectionRecord> BatteryInspectionRecords { get; set; } = null!;
    public DbSet<OilInspectionRecord> OilInspectionRecords { get; set; } = null!;
    public DbSet<Designation> Designations { get; set; } = null!;
    public DbSet<UserDesignation> UserDesignations { get; set; } = null!;
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ────────────────────────────────────────────────
        // User configuration
        // ────────────────────────────────────────────────
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.EmployeeId)
            .IsUnique();

        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>()
            .HasMaxLength(50);

        // ────────────────────────────────────────────────
        // Service (master table) – unique code & name
        // ────────────────────────────────────────────────
        modelBuilder.Entity<Service>()
            .HasIndex(s => s.Code)
            .IsUnique();

        modelBuilder.Entity<Service>()
            .HasIndex(s => s.Name)
            .IsUnique();

        // ────────────────────────────────────────────────
        // Many-to-Many: Service ↔ ServiceEnquiry
        // ────────────────────────────────────────────────
        modelBuilder.Entity<ServiceEnquiryService>()
            .HasKey(es => new { es.ServiceEnquiryId, es.ServiceId });

        modelBuilder.Entity<ServiceEnquiry>()
        .HasIndex(e => e.VehicleNo)
        .IsUnique(false); // non-unique, multiple enquiries per vehicle are normal

        modelBuilder.Entity<ServiceEnquiryService>()
            .HasOne(es => es.ServiceEnquiry)
            .WithMany(e => e.SelectedServices)
            .HasForeignKey(es => es.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ServiceEnquiryService>()
            .HasOne(es => es.Service)
            .WithMany(s => s.EnquiryServices)
            .HasForeignKey(es => es.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);

        // ────────────────────────────────────────────────
        // One-to-one relationships for checklists & inspections
        // ────────────────────────────────────────────────

        // Tyre checklist & inspection
        modelBuilder.Entity<TyreChecklistRecord>()
            .HasOne(c => c.ServiceEnquiry)
            .WithOne(e => e.TyreChecklist)
            .HasForeignKey<TyreChecklistRecord>(c => c.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TyreRotationInspectionRecord>()
            .HasOne(i => i.ServiceEnquiry)
            .WithOne(e => e.TyreRotationInspection)
            .HasForeignKey<TyreRotationInspectionRecord>(i => i.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TyreInspectionRecord>()
            .HasOne(i => i.ServiceEnquiry)
            .WithOne(e => e.TyreInspection)
            .HasForeignKey<TyreInspectionRecord>(i => i.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        // Alignment
        modelBuilder.Entity<AlignmentChecklistRecord>()
            .HasOne(c => c.ServiceEnquiry)
            .WithOne(e => e.AlignmentChecklist)
            .HasForeignKey<AlignmentChecklistRecord>(c => c.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AlignmentInspectionRecord>()
            .HasOne(i => i.ServiceEnquiry)
            .WithOne(e => e.AlignmentInspection)
            .HasForeignKey<AlignmentInspectionRecord>(i => i.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        // Balancing
        modelBuilder.Entity<BalancingChecklistRecord>()
            .HasOne(c => c.ServiceEnquiry)
            .WithOne(e => e.BalancingChecklist)
            .HasForeignKey<BalancingChecklistRecord>(c => c.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BalancingInspectionRecord>()
            .HasOne(i => i.ServiceEnquiry)
            .WithOne(e => e.BalancingInspection)
            .HasForeignKey<BalancingInspectionRecord>(i => i.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        // PUC
        modelBuilder.Entity<PucChecklistRecord>()
            .HasOne(c => c.ServiceEnquiry)
            .WithOne(e => e.PucChecklist)
            .HasForeignKey<PucChecklistRecord>(c => c.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PucInspectionRecord>()
            .HasOne(i => i.ServiceEnquiry)
            .WithOne(e => e.PucInspection)
            .HasForeignKey<PucInspectionRecord>(i => i.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        // Car Wash
        modelBuilder.Entity<CarWashChecklistRecord>()
            .HasOne(c => c.ServiceEnquiry)
            .WithOne(e => e.CarWashChecklist)
            .HasForeignKey<CarWashChecklistRecord>(c => c.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CarWashInspectionRecord>()
            .HasOne(i => i.ServiceEnquiry)
            .WithOne(e => e.CarWashInspection)
            .HasForeignKey<CarWashInspectionRecord>(i => i.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        // Battery & Oil (inspection only)
        modelBuilder.Entity<BatteryInspectionRecord>()
            .HasOne(i => i.ServiceEnquiry)
            .WithOne(e => e.BatteryInspection)
            .HasForeignKey<BatteryInspectionRecord>(i => i.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OilInspectionRecord>()
            .HasOne(i => i.ServiceEnquiry)
            .WithOne(e => e.OilInspection)
            .HasForeignKey<OilInspectionRecord>(i => i.ServiceEnquiryId)
            .OnDelete(DeleteBehavior.Cascade);

        // ────────────────────────────────────────────────
        // Fix: Treat TyreValues as owned types (embedded columns)
        // ────────────────────────────────────────────────
        modelBuilder.Entity<TyreInspectionRecord>(builder =>
        {
            // FrontLeft tyre
            builder.OwnsOne(i => i.FrontLeft, owned =>
            {
                owned.Property(v => v.TreadDepth).HasColumnName("FrontLeft_TreadDepth");
                owned.Property(v => v.TyrePressure).HasColumnName("FrontLeft_TyrePressure");
            });

            // FrontRight tyre
            builder.OwnsOne(i => i.FrontRight, owned =>
            {
                owned.Property(v => v.TreadDepth).HasColumnName("FrontRight_TreadDepth");
                owned.Property(v => v.TyrePressure).HasColumnName("FrontRight_TyrePressure");
            });

            // RearLeft tyre
            builder.OwnsOne(i => i.RearLeft, owned =>
            {
                owned.Property(v => v.TreadDepth).HasColumnName("RearLeft_TreadDepth");
                owned.Property(v => v.TyrePressure).HasColumnName("RearLeft_TyrePressure");
            });

            // RearRight tyre
            builder.OwnsOne(i => i.RearRight, owned =>
            {
                owned.Property(v => v.TreadDepth).HasColumnName("RearRight_TreadDepth");
                owned.Property(v => v.TyrePressure).HasColumnName("RearRight_TyrePressure");
            });
        });

        modelBuilder.Entity<Designation>()
    .HasIndex(d => d.Code)
    .IsUnique();

modelBuilder.Entity<Designation>()
    .HasIndex(d => d.Name)
    .IsUnique();

modelBuilder.Entity<Designation>()
    .HasOne(d => d.Service)
    .WithOne(s => s.Designation)
    .HasForeignKey<Designation>(d => d.ServiceId)
    .OnDelete(DeleteBehavior.Cascade);  // or Restrict if you prefer

modelBuilder.Entity<UserDesignation>()
    .HasKey(ud => new { ud.UserId, ud.DesignationId });

modelBuilder.Entity<UserDesignation>()
    .HasOne(ud => ud.User)
    .WithMany(u => u.UserDesignations)
    .HasForeignKey(ud => ud.UserId)
    .OnDelete(DeleteBehavior.Cascade);

modelBuilder.Entity<UserDesignation>()
    .HasOne(ud => ud.Designation)
    .WithMany(d => d.UserDesignations)
    .HasForeignKey(ud => ud.DesignationId)
    .OnDelete(DeleteBehavior.Cascade);
    
 // Inside OnModelCreating, after all other configurations
foreach (var entityType in modelBuilder.Model.GetEntityTypes())
{
    foreach (var property in entityType.GetProperties())
    {
        if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
        {
            property.SetValueConverter(
                new ValueConverter<DateTime?, DateTime?>(
                    v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : null,
                    v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : null
                )
            );
        }
    }
}
    }

    
}