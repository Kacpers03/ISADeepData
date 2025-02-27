using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Models.Contractors;
using Models.Cruises;
using Models.Stations;
using Models.Valid_Value;
using Models.Qualifiers;
using Models.Photo_Video;
using Models.Libarys;
using Models.Geo_result;
using Models.Env_Result;
using Models.CTD_Data;
using Models.Samples;


namespace Api.Data
{
    public static class DbInitializer
    {
        public static void Initialize(MyDbContext context)
        {
            // Sørg for at databasen er opprettet
            context.Database.EnsureCreated();

            // Sjekk om databasen allerede er seedet (for eksempel ved å sjekke en tabell)
            if (context.ContractTypes.Any())
            {
                return; // Databasen er allerede seedet
            }

            // --- Seed Contract Types ---
            context.ContractTypes.AddRange(
                new ContractType 
                { 
                    ContractTypeId = 1, 
                    ContractTypeName = "Polymetallic Nodules" 
                }
            );

            // --- Seed Contract Statuses ---
            context.ContractStatuses.AddRange(
                new ContractStatus 
                { 
                    ContractStatusId = 1, 
                    ContractStatusName = "Active" 
                }
            );

            // --- Seed Contractors ---
            context.Contractors.AddRange(
                new Contractor {
                    ContractorId = 1,
                    ContractorName = "Federal Institute for Geosciences and Natural Resources of Germany – PMN",
                    ContractTypeId = 1,
                    ContractStatusId = 1,
                    ContractNumber = "1",
                    SponsoringState = "Germany",
                    ContractualYear = 2006,
                    Remarks = ""
                },
                new Contractor {
                    ContractorId = 2,
                    ContractorName = "China Ocean Mineral Resources Research and Development Association – PMN",
                    ContractTypeId = 1,
                    ContractStatusId = 1,
                    ContractNumber = "1",
                    SponsoringState = "China",
                    ContractualYear = 2001,
                    Remarks = ""
                },
                new Contractor {
                    ContractorId = 3,
                    ContractorName = "China Minmetals Corporation – PMN",
                    ContractTypeId = 1,
                    ContractStatusId = 1,
                    ContractNumber = "1",
                    SponsoringState = "China",
                    ContractualYear = 2017,
                    Remarks = ""
                },
                new Contractor {
                    ContractorId = 4,
                    ContractorName = "Beijing Pioneer Hi-Tech Development Corporation – PMN",
                    ContractTypeId = 1,
                    ContractStatusId = 1,
                    ContractNumber = "3",
                    SponsoringState = "China",
                    ContractualYear = 2019,
                    Remarks = ""
                },
                new Contractor {
                    ContractorId = 5,
                    ContractorName = "Deep Ocean Resources Development Co. Ltd. – PMN",
                    ContractTypeId = 1,
                    ContractStatusId = 1,
                    ContractNumber = "1",
                    SponsoringState = "Japan",
                    ContractualYear = 2015,
                    Remarks = ""
                }
            );

            // --- Seed Contractor Areas ---
            context.ContractorAreas.AddRange(
                new ContractorArea { AreaId = 1, ContractorId = 1, AreaName = "Exploration Area 1 (BGR)", AreaDescription = null },
                new ContractorArea { AreaId = 2, ContractorId = 2, AreaName = "Exploration Area 1 (COMRA)", AreaDescription = null },
                new ContractorArea { AreaId = 3, ContractorId = 3, AreaName = "Exploration Area 1 (CMM)", AreaDescription = null },
                new ContractorArea { AreaId = 4, ContractorId = 4, AreaName = "Exploration Area 1 (BPHDC)", AreaDescription = null },
                new ContractorArea { AreaId = 5, ContractorId = 5, AreaName = "Exploration Area 1 (DORD)", AreaDescription = null }
            );

            // --- Seed Contractor Area Blocks ---
            context.ContractorAreaBlocks.AddRange(
                new ContractorAreaBlock { BlockId = 1, AreaId = 1, BlockName = "Block 1", BlockDescription = "Default block", Status = "Active" },
                new ContractorAreaBlock { BlockId = 2, AreaId = 2, BlockName = "Block 1", BlockDescription = "Default block", Status = "Active" },
                new ContractorAreaBlock { BlockId = 3, AreaId = 3, BlockName = "Block 1", BlockDescription = "Default block", Status = "Active" },
                new ContractorAreaBlock { BlockId = 4, AreaId = 4, BlockName = "Block 1", BlockDescription = "Default block", Status = "Active" },
                new ContractorAreaBlock { BlockId = 5, AreaId = 5, BlockName = "Block 1", BlockDescription = "Default block", Status = "Active" }
            );

            // --- Seed Cruises ---
            context.Cruises.AddRange(
                new Cruise { CruiseId = 1, ContractorId = 1, CruiseName = "BIONOD12_1", ResearchVessel = null, StartDate = new DateTime(2012, 4, 2), EndDate = new DateTime(2012, 4, 12) },
                new Cruise { CruiseId = 2, ContractorId = 2, CruiseName = "DY2008_DY115_20_1", ResearchVessel = null, StartDate = new DateTime(2008, 1, 1), EndDate = new DateTime(2008, 12, 31) },
                new Cruise { CruiseId = 3, ContractorId = 2, CruiseName = "DY2008_DY115_20_2", ResearchVessel = null, StartDate = new DateTime(2008, 1, 1), EndDate = new DateTime(2008, 12, 31) },
                new Cruise { CruiseId = 4, ContractorId = 2, CruiseName = "DY2009_DY115_21_1", ResearchVessel = null, StartDate = new DateTime(2009, 11, 1), EndDate = new DateTime(2009, 12, 31) },
                new Cruise { CruiseId = 5, ContractorId = 2, CruiseName = "DY2009_DY115_21_2", ResearchVessel = null, StartDate = new DateTime(2009, 11, 1), EndDate = new DateTime(2009, 12, 31) },
                new Cruise { CruiseId = 6, ContractorId = 2, CruiseName = "DY2011_DY125_22_9", ResearchVessel = null, StartDate = new DateTime(2011, 11, 10), EndDate = new DateTime(2011, 11, 13) },
                new Cruise { CruiseId = 7, ContractorId = 2, CruiseName = "DY73_I", ResearchVessel = null, StartDate = new DateTime(2022, 9, 3), EndDate = new DateTime(2022, 10, 2) },
                new Cruise { CruiseId = 8, ContractorId = 2, CruiseName = "DY73_II", ResearchVessel = null, StartDate = new DateTime(2022, 10, 4), EndDate = new DateTime(2022, 10, 6) },
                new Cruise { CruiseId = 9, ContractorId = 2, CruiseName = "DY79_II", ResearchVessel = null, StartDate = new DateTime(2023, 10, 12), EndDate = new DateTime(2023, 10, 19) },
                new Cruise { CruiseId = 10, ContractorId = 5, CruiseName = "FY2015_1", ResearchVessel = null, StartDate = new DateTime(2015, 6, 1), EndDate = new DateTime(2015, 6, 30) },
                new Cruise { CruiseId = 11, ContractorId = 4, CruiseName = "DY69_1", ResearchVessel = null, StartDate = new DateTime(2021, 10, 9), EndDate = new DateTime(2021, 10, 29) },
                new Cruise { CruiseId = 12, ContractorId = 3, CruiseName = "DY79_I", ResearchVessel = null, StartDate = new DateTime(2023, 8, 28), EndDate = new DateTime(2023, 10, 8) },
                new Cruise { CruiseId = 13, ContractorId = 3, CruiseName = "DY2021_DY70_I", ResearchVessel = null, StartDate = new DateTime(2021, 10, 23), EndDate = new DateTime(2021, 11, 10) },
                new Cruise { CruiseId = 14, ContractorId = 3, CruiseName = "DY2022_DY73_I", ResearchVessel = null, StartDate = new DateTime(2022, 9, 3), EndDate = new DateTime(2022, 9, 4) }
            );

            // --- Seed Stations (eksempler; utvid med alle stasjoner etter behov) ---
            context.Stations.AddRange(
                new Station { StationId = 1, CruiseId = 1, StationCode = "Bio12-48SC", StationType = "CTD Station", Latitude = 11.7897, Longitude = -117.5983 },
                new Station { StationId = 2, CruiseId = 10, StationCode = "15MNRO09 St.W", StationType = "CTD Station", Latitude = 10.50071667, Longitude = -149.00248333 },
                new Station { StationId = 3, CruiseId = 10, StationCode = "15MNRO10 St.C", StationType = "CTD Station", Latitude = 10.50000000, Longitude = -149.00000000 },
                new Station { StationId = 73, CruiseId = 12, StationCode = "DY79I-KW1-CTD01", StationType = "CTD Station", Latitude = 10.003132, Longitude = -154.012328 }
            );

            // --- Seed Samples (eksempler; utvid med alle sample-poster etter behov) ---
            context.Samples.AddRange(
                new Sample { SampleId = 1, StationId = 1, SampleCode = "Bio12-48SC", SampleType = "Water", MatrixType = "Seawater", HabitatType = "Water Column", SamplingDevice = "CTD Rosette", DepthLower = 4.0, DepthUpper = 4.0, SampleDescription = null },
                new Sample { SampleId = 2, StationId = 2, SampleCode = "DOR31", SampleType = "Water", MatrixType = "Seawater", HabitatType = "Water Column", SamplingDevice = "CTD Rosette", DepthLower = 0.0, DepthUpper = 0.0, SampleDescription = null },
                new Sample { SampleId = 3, StationId = 2, SampleCode = "DOR32", SampleType = "Water", MatrixType = "Seawater", HabitatType = "Water Column", SamplingDevice = "CTD Rosette", DepthLower = 0.0, DepthUpper = 0.0, SampleDescription = null },
                new Sample { SampleId = 150, StationId = 73, SampleCode = "DY79I-KW1-CTD01-01", SampleType = "Water", MatrixType = "Seawater", HabitatType = "Water Column", SamplingDevice = "CTD Rosette", DepthLower = 5.0, DepthUpper = 5.0, SampleDescription = null },
                new Sample { SampleId = 151, StationId = 73, SampleCode = "DY79I-KW1-CTD01-03", SampleType = "Water", MatrixType = "Seawater", HabitatType = "Water Column", SamplingDevice = "CTD Rosette", DepthLower = 125.0, DepthUpper = 125.0, SampleDescription = null }
            );

            // --- Seed PhotoVideos (eksempler, dersom aktuelt) ---
            context.PhotoVideos.AddRange(
                new PhotoVideo { MediaId = 1, SampleId = 1, FileName = "photo1.jpg", MediaType = "Photo", CameraSpecs = "GoPro", CaptureDate = new DateTime(2023, 1, 11), Remarks = "Clear water conditions" },
                new PhotoVideo { MediaId = 2, SampleId = 2, FileName = "video1.mp4", MediaType = "Video", CameraSpecs = "Underwater Cam", CaptureDate = new DateTime(2022, 5, 16), Remarks = "Sediment sampling in progress" }
            );

            // --- Seed EnvResults (eksempler; utvid med alle målinger etter behov) ---
            context.EnvResults.AddRange(
                new EnvResult { EnvResultId = 1, SampleId = 1, AnalysisCategory = "Water Properties", AnalysisName = "Water Temperature", AnalysisValue = 27.1419, Units = "°C", Remarks = null },
                new EnvResult { EnvResultId = 2, SampleId = 1, AnalysisCategory = "Water Properties", AnalysisName = "Salinity", AnalysisValue = 34.2873, Units = "psu", Remarks = null },
                new EnvResult { EnvResultId = 3, SampleId = 1, AnalysisCategory = "Water Properties", AnalysisName = "Chlorophyll a", AnalysisValue = 0.169, Units = "mg/m³", Remarks = null },
                new EnvResult { EnvResultId = 4, SampleId = 2, AnalysisCategory = "Nutrients", AnalysisName = "Nitrite (NO₂-N)", AnalysisValue = 0.001, Units = "mg/L", Remarks = null },
                new EnvResult { EnvResultId = 5, SampleId = 151, AnalysisCategory = "Water Properties", AnalysisName = "Dissolved oxygen (DO)", AnalysisValue = 6.41, Units = "mg/L", Remarks = null },
                new EnvResult { EnvResultId = 6, SampleId = 151, AnalysisCategory = "Water Properties", AnalysisName = "pH", AnalysisValue = 7.8, Units = null, Remarks = null }
            );

            // Lagre alle endringer
            context.SaveChanges();
        }
    }
}
