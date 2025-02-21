using Microsoft.EntityFrameworkCore;
using Models.Contractor; // Husk å bruke riktig namespace for dine entiteter

namespace MyProject.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options)
            : base(options)
        {
        }

        // DbSets for dine entiteter
        public DbSet<ContractType> ContractTypes { get; set; }
        public DbSet<ContractStatus> ContractStatuses { get; set; }
        public DbSet<Contractor> Contractors { get; set; }
        public DbSet<ContractorArea> ContractorAreas { get; set; }
        public DbSet<ContractorAreaBlock> ContractorAreaBlocks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Konfigurasjon for ContractType
            modelBuilder.Entity<ContractType>(entity =>
            {
                entity.HasKey(ct => ct.ContractTypeId);
                entity.Property(ct => ct.ContractTypeName)
                      .HasMaxLength(100)
                      .IsRequired();
                // Definer eventuelt andre konfigurasjoner
            });

            // Konfigurasjon for ContractStatus
            modelBuilder.Entity<ContractStatus>(entity =>
            {
                entity.HasKey(cs => cs.ContractStatusId);
                entity.Property(cs => cs.ContractStatusName)
                      .HasMaxLength(100)
                      .IsRequired();
            });

            // Konfigurasjon for Contractor
            modelBuilder.Entity<Contractor>(entity =>
            {
                entity.HasKey(c => c.ContractorId);
                entity.Property(c => c.ContractorName)
                      .HasMaxLength(255)
                      .IsRequired();
                entity.Property(c => c.ContractNumber)
                      .HasMaxLength(100);
                entity.Property(c => c.SponsoringState)
                      .HasMaxLength(100);
                
                // Relasjon Contractor -> ContractType
                entity.HasOne(c => c.ContractType)
                      .WithMany(ct => ct.Contractors)
                      .HasForeignKey(c => c.ContractTypeId)
                      .OnDelete(DeleteBehavior.Restrict);
                
                // Relasjon Contractor -> ContractStatus
                entity.HasOne(c => c.ContractStatus)
                      .WithMany(cs => cs.Contractors)
                      .HasForeignKey(c => c.ContractStatusId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Konfigurasjon for ContractorArea
            modelBuilder.Entity<ContractorArea>(entity =>
            {
                entity.HasKey(ca => ca.AreaId);
                entity.Property(ca => ca.AreaName)
                      .HasMaxLength(255)
                      .IsRequired();
                
                // Relasjon ContractorArea -> Contractor
                entity.HasOne(ca => ca.Contractor)
                      .WithMany(c => c.ContractorAreas)
                      .HasForeignKey(ca => ca.ContractorId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Konfigurasjon for ContractorAreaBlock
            modelBuilder.Entity<ContractorAreaBlock>(entity =>
            {
                entity.HasKey(cab => cab.BlockId);
                entity.Property(cab => cab.BlockName)
                      .HasMaxLength(255)
                      .IsRequired();
                entity.Property(cab => cab.Status)
                      .HasMaxLength(100);
                
                // Relasjon ContractorAreaBlock -> ContractorArea
                entity.HasOne(cab => cab.ContractorArea)
                      .WithMany(ca => ca.ContractorAreaBlocks)
                      .HasForeignKey(cab => cab.AreaId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
