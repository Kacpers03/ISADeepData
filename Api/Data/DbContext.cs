using Microsoft.EntityFrameworkCore;
using Models.Contractors;
using Models.Cruises;
using Models.Stations;
using Models.Valid_Value;
using Models.Qualifiers;
using Models.Photo_Video;
using Models.Librarys;
using Models.Geo_result;
using Models.Env_Result;
using Models.CTD_Data;
using Models.Samples;

namespace Api.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options)
            : base(options)
        {
        }

        // Contract-relaterte tabeller
        public DbSet<Contractor> Contractors { get; set; }
        public DbSet<ContractorArea> ContractorAreas { get; set; }
        public DbSet<ContractorAreaBlock> ContractorAreaBlocks { get; set; }
        public DbSet<ContractType> ContractTypes { get; set; }
        public DbSet<ContractStatus> ContractStatuses { get; set; }

        // Andre tabeller
        public DbSet<Cruise> Cruises { get; set; }
        public DbSet<Station> Stations { get; set; }
        public DbSet<Sample> Samples { get; set; }
        public DbSet<CTDData> CtdDataSet { get; set; }
        public DbSet<EnvResult> EnvResults { get; set; }
        public DbSet<GeoResult> GeoResults { get; set; }
        public DbSet<PhotoVideo> PhotoVideos { get; set; }
        public DbSet<Library> Libraries { get; set; }
        public DbSet<Qualifier> Qualifiers { get; set; }
        public DbSet<ValidValue> ValidValues { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relasjoner for kontraktdelene

            // ContractorArea -> Contractor
            modelBuilder.Entity<ContractorArea>()
                .HasOne(a => a.Contractor)
                .WithMany(c => c.ContractorAreas)
                .HasForeignKey(a => a.ContractorId)
                .OnDelete(DeleteBehavior.Cascade);

            // ContractorAreaBlock -> ContractorArea
            modelBuilder.Entity<ContractorAreaBlock>()
                .HasOne(b => b.ContractorArea)
                .WithMany(a => a.ContractorAreaBlocks)
                .HasForeignKey(b => b.AreaId)
                .OnDelete(DeleteBehavior.Cascade);

            // Contractor -> ContractType
            modelBuilder.Entity<Contractor>()
                .HasOne(c => c.ContractType)
                .WithMany(ct => ct.Contractors)
                .HasForeignKey(c => c.ContractTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Contractor -> ContractStatus
            modelBuilder.Entity<Contractor>()
                .HasOne(c => c.ContractStatus)
                .WithMany(cs => cs.Contractors)
                .HasForeignKey(c => c.ContractStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            // Eksempel på relasjoner for øvrige tabeller

            // Cruise -> Contractor
            modelBuilder.Entity<Cruise>()
                .HasOne(cr => cr.Contractor)
                .WithMany(c => c.Cruises)
                .HasForeignKey(cr => cr.ContractorId)
                .OnDelete(DeleteBehavior.Cascade);

            // Station -> Cruise
            modelBuilder.Entity<Station>()
                .HasOne(st => st.Cruise)
                .WithMany(cr => cr.Stations)
                .HasForeignKey(st => st.CruiseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Sample -> Station
            modelBuilder.Entity<Sample>()
                .HasOne(s => s.Station)
                .WithMany(st => st.Samples)
                .HasForeignKey(s => s.StationId)
                .OnDelete(DeleteBehavior.Cascade);

            // CTDData -> Station
            modelBuilder.Entity<CTDData>()
                .HasOne(ctd => ctd.Station)
                .WithMany(st => st.CtdDataSet)
                .HasForeignKey(ctd => ctd.StationId)
                .OnDelete(DeleteBehavior.Cascade);

            // EnvResult -> Sample
            modelBuilder.Entity<EnvResult>()
                .HasOne(er => er.Sample)
                .WithMany(s => s.EnvResults)
                .HasForeignKey(er => er.SampleId)
                .OnDelete(DeleteBehavior.Cascade);

            // GeoResult -> Sample
            modelBuilder.Entity<GeoResult>()
                .HasOne(gr => gr.Sample)
                .WithMany(s => s.GeoResults)
                .HasForeignKey(gr => gr.SampleId)
                .OnDelete(DeleteBehavior.Cascade);

            // PhotoVideo -> Sample
            modelBuilder.Entity<PhotoVideo>()
                .HasOne(pv => pv.Sample)
                .WithMany(s => s.PhotoVideos)
                .HasForeignKey(pv => pv.SampleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Library -> Contractor
            modelBuilder.Entity<Library>()
                .HasOne(lb => lb.Contractor)
                .WithMany(c => c.Libraries)
                .HasForeignKey(lb => lb.ContractorId)
                .OnDelete(DeleteBehavior.Cascade);

            // CHECK CONSTRAINTS

            // For Sample: Sørg for at DepthUpper > DepthLower
            modelBuilder.Entity<Sample>()
                .HasCheckConstraint("CK_Sample_Depth", "[DepthUpper] > [DepthLower]");

            // For CTDData: Eksempelverdier (juster intervallene etter behov)
            modelBuilder.Entity<CTDData>()
                .HasCheckConstraint("CK_CTD_Temperature", "[TemperatureC] >= -5 AND [TemperatureC] <= 40")
                .HasCheckConstraint("CK_CTD_Salinity", "[Salinity] >= 0 AND [Salinity] <= 60")
                .HasCheckConstraint("CK_CTD_Oxygen", "[Oxygen] >= 0 AND [Oxygen] <= 20")
                .HasCheckConstraint("CK_CTD_Ph", "[Ph] >= 0 AND [Ph] <= 14");
        }
    }
}
