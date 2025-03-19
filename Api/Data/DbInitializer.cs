using System;
using System.Linq;
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
using Api.Helpers;

namespace Api.Data
{
    public static class DbInitializer
    {
        public static void Initialize(MyDbContext context)
        {
            // Ensure database is created
            context.Database.EnsureCreated();

            // Check if database is already seeded
            if (context.ContractTypes.Any())
            {
                return; // Database already seeded
            }

            // --- Seed Contract Types ---
            context.ContractTypes.AddRange(
                new ContractType { ContractTypeId = 1, ContractTypeName = "Polymetallic Nodules" },
                new ContractType { ContractTypeId = 2, ContractTypeName = "Polymetallic Sulphides" },
                new ContractType { ContractTypeId = 3, ContractTypeName = "Cobalt-rich Crusts" }
            );

            // --- Seed Contract Statuses ---
            context.ContractStatuses.AddRange(
                new ContractStatus { ContractStatusId = 1, ContractStatusName = "Active" },
                new ContractStatus { ContractStatusId = 2, ContractStatusName = "Pending" },
                new ContractStatus { ContractStatusId = 3, ContractStatusName = "Expired" },
                new ContractStatus { ContractStatusId = 4, ContractStatusName = "Suspended" }
            );

            // --- Seed Contractors ---
            // Original contractors
            context.Contractors.AddRange(
                new Contractor {
                    ContractorId = 1,
                    ContractorName = "Federal Institute for Geosciences and Natural Resources of Germany – PMN",
                    ContractTypeId = 1,
                    ContractStatusId = 1,
                    ContractNumber = "ISBA/21/C/1",
                    SponsoringState = "Germany",
                    ContractualYear = 2006,
                    Remarks = "Research focused on polymetallic nodules in the Clarion-Clipperton Zone"
                },
                new Contractor {
                    ContractorId = 2,
                    ContractorName = "China Ocean Mineral Resources Research and Development Association – PMN",
                    ContractTypeId = 1,
                    ContractStatusId = 1,
                    ContractNumber = "ISBA/16/C/5",
                    SponsoringState = "China",
                    ContractualYear = 2001,
                    Remarks = "Long-term exploration in the CCZ region"
                },
                new Contractor {
                    ContractorId = 3,
                    ContractorName = "China Minmetals Corporation – PMN",
                    ContractTypeId = 1,
                    ContractStatusId = 1,
                    ContractNumber = "ISBA/22/C/17",
                    SponsoringState = "China",
                    ContractualYear = 2017,
                    Remarks = "Focused on mineral resource assessment and environmental studies"
                },
                new Contractor {
                    ContractorId = 4,
                    ContractorName = "Beijing Pioneer Hi-Tech Development Corporation – PMN",
                    ContractTypeId = 1,
                    ContractStatusId = 1,
                    ContractNumber = "ISBA/24/C/22",
                    SponsoringState = "China",
                    ContractualYear = 2019,
                    Remarks = "Specialized in advanced technological approaches to deep sea mining"
                },
                new Contractor {
                    ContractorId = 5,
                    ContractorName = "Deep Ocean Resources Development Co. Ltd. – PMN",
                    ContractTypeId = 1,
                    ContractStatusId = 1,
                    ContractNumber = "ISBA/19/C/3",
                    SponsoringState = "Japan",
                    ContractualYear = 2015,
                    Remarks = "Japanese consortium focusing on polymetallic nodule assessment"
                }
            );

            // New contracts for different ocean regions
            context.Contractors.AddRange(
                // Atlantic Ocean - Mid-Atlantic Ridge
                new Contractor {
                    ContractorId = 6,
                    ContractorName = "Institut français de recherche pour l'exploitation de la mer (IFREMER)",
                    ContractTypeId = 2, // Polymetallic Sulphides
                    ContractStatusId = 1, // Active
                    ContractNumber = "ISBA/18/C/15",
                    SponsoringState = "France",
                    ContractualYear = 2014,
                    Remarks = "Exploration of hydrothermal vents along the Mid-Atlantic Ridge"
                },
                // Indian Ocean - Central Indian Ridge
                new Contractor {
                    ContractorId = 7,
                    ContractorName = "National Institute of Ocean Technology (NIOT)",
                    ContractTypeId = 2, // Polymetallic Sulphides
                    ContractStatusId = 1, // Active
                    ContractNumber = "ISBA/20/C/7",
                    SponsoringState = "India",
                    ContractualYear = 2016,
                    Remarks = "Research on deep-sea mineral deposits in the Indian Ocean"
                },
                // Pacific Ocean - Western Pacific
                new Contractor {
                    ContractorId = 8,
                    ContractorName = "Korea Ocean Research and Development Institute (KORDI)",
                    ContractTypeId = 3, // Cobalt-rich Crusts
                    ContractStatusId = 1, // Active
                    ContractNumber = "ISBA/23/C/9",
                    SponsoringState = "South Korea",
                    ContractualYear = 2018,
                    Remarks = "Exploration of seamounts for cobalt-rich ferromanganese crusts"
                }
            );

            // --- Seed Contractor Areas ---
            // Original areas
            context.ContractorAreas.AddRange(
                new ContractorArea { 
                    AreaId = 1, 
                    ContractorId = 1, 
                    AreaName = "Exploration Area 1 (BGR)", 
                    AreaDescription = "Clarion-Clipperton Zone exploration area",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(10.7, -120.5, 12.8, -115.6),
                    CenterLatitude = 11.75,
                    CenterLongitude = -118.05,
                    TotalAreaSizeKm2 = 75000,
                    AllocationDate = new DateTime(2006, 7, 19),
                    ExpiryDate = new DateTime(2026, 7, 18)
                },
                new ContractorArea { 
                    AreaId = 2, 
                    ContractorId = 2, 
                    AreaName = "Exploration Area 1 (COMRA)", 
                    AreaDescription = "Eastern Pacific exploration zone",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(9.5, -125.3, 11.4, -122.7),
                    CenterLatitude = 10.45,
                    CenterLongitude = -124.0,
                    TotalAreaSizeKm2 = 70000,
                    AllocationDate = new DateTime(2001, 5, 22),
                    ExpiryDate = new DateTime(2026, 5, 21)
                },
                new ContractorArea { 
                    AreaId = 3, 
                    ContractorId = 3, 
                    AreaName = "Exploration Area 1 (CMM)", 
                    AreaDescription = "Western CCZ region",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(12.5, -128.4, 14.2, -124.8),
                    CenterLatitude = 13.35,
                    CenterLongitude = -126.6,
                    TotalAreaSizeKm2 = 73000,
                    AllocationDate = new DateTime(2017, 5, 12),
                    ExpiryDate = new DateTime(2032, 5, 11)
                },
                new ContractorArea { 
                    AreaId = 4, 
                    ContractorId = 4, 
                    AreaName = "Exploration Area 1 (BPHDC)", 
                    AreaDescription = "Northern CCZ exploration zone",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(15.8, -126.7, 17.5, -124.2),
                    CenterLatitude = 16.65,
                    CenterLongitude = -125.45,
                    TotalAreaSizeKm2 = 68000,
                    AllocationDate = new DateTime(2019, 7, 30),
                    ExpiryDate = new DateTime(2034, 7, 29)
                },
                new ContractorArea { 
                    AreaId = 5, 
                    ContractorId = 5, 
                    AreaName = "Exploration Area 1 (DORD)", 
                    AreaDescription = "Eastern CCZ region",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(10.0, -150.0, 11.0, -148.0),
                    CenterLatitude = 10.5,
                    CenterLongitude = -149.0,
                    TotalAreaSizeKm2 = 75000,
                    AllocationDate = new DateTime(2015, 1, 17),
                    ExpiryDate = new DateTime(2030, 1, 16)
                }
            );

            // New areas for the new contracts
            context.ContractorAreas.AddRange(
                // Mid-Atlantic Ridge
                new ContractorArea { 
                    AreaId = 6, 
                    ContractorId = 6, 
                    AreaName = "Mid-Atlantic Ridge Exploration Zone", 
                    AreaDescription = "Hydrothermal vent field exploration in the Mid-Atlantic Ridge",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(25.7, -45.2, 27.8, -43.1),
                    CenterLatitude = 26.75,
                    CenterLongitude = -44.15,
                    TotalAreaSizeKm2 = 10000,
                    AllocationDate = new DateTime(2014, 11, 18),
                    ExpiryDate = new DateTime(2029, 11, 17)
                },
                // Indian Ocean
                new ContractorArea { 
                    AreaId = 7, 
                    ContractorId = 7, 
                    AreaName = "Central Indian Ridge Exploration Area", 
                    AreaDescription = "Polymetallic sulphide research area along the Central Indian Ridge",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(-10.5, 65.3, -8.7, 68.2),
                    CenterLatitude = -9.6,
                    CenterLongitude = 66.75,
                    TotalAreaSizeKm2 = 10000,
                    AllocationDate = new DateTime(2016, 9, 28),
                    ExpiryDate = new DateTime(2031, 9, 27)
                },
                // Western Pacific
                new ContractorArea { 
                    AreaId = 8, 
                    ContractorId = 8, 
                    AreaName = "Western Pacific Seamount Chain", 
                    AreaDescription = "Exploration focusing on cobalt-rich crusts on Pacific seamounts",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(15.2, 155.7, 17.5, 158.2),
                    CenterLatitude = 16.35,
                    CenterLongitude = 156.95,
                    TotalAreaSizeKm2 = 9000,
                    AllocationDate = new DateTime(2018, 3, 27),
                    ExpiryDate = new DateTime(2033, 3, 26)
                }
            );

            // --- Seed Contractor Area Blocks ---
            // Original blocks
            context.ContractorAreaBlocks.AddRange(
                new ContractorAreaBlock { 
                    BlockId = 1, 
                    AreaId = 1, 
                    BlockName = "Block A", 
                    BlockDescription = "Northern sector", 
                    Status = "Active",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(11.8, -120.0, 12.8, -118.0),
                    CenterLatitude = 12.3,
                    CenterLongitude = -119.0,
                    AreaSizeKm2 = 24000,
                    Category = "N/A"
                },
                new ContractorAreaBlock { 
                    BlockId = 2, 
                    AreaId = 2, 
                    BlockName = "Block 1", 
                    BlockDescription = "Primary exploration zone", 
                    Status = "Active",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(10.0, -124.5, 11.4, -123.5),
                    CenterLatitude = 10.7,
                    CenterLongitude = -124.0,
                    AreaSizeKm2 = 22000,
                    Category = "N/A"
                },
                new ContractorAreaBlock { 
                    BlockId = 3, 
                    AreaId = 3, 
                    BlockName = "Block 1", 
                    BlockDescription = "High-density nodule area", 
                    Status = "Active",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(13.0, -127.0, 14.2, -125.5),
                    CenterLatitude = 13.6,
                    CenterLongitude = -126.25,
                    AreaSizeKm2 = 25000,
                    Category = "N/A"
                },
                new ContractorAreaBlock { 
                    BlockId = 4, 
                    AreaId = 4, 
                    BlockName = "Block 1", 
                    BlockDescription = "Primary research block", 
                    Status = "Active",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(16.2, -126.0, 17.5, -124.8),
                    CenterLatitude = 16.85,
                    CenterLongitude = -125.4,
                    AreaSizeKm2 = 20000,
                    Category = "N/A"
                },
                new ContractorAreaBlock { 
                    BlockId = 5, 
                    AreaId = 5, 
                    BlockName = "Block 1", 
                    BlockDescription = "Prime exploration area", 
                    Status = "Active",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(10.3, -149.5, 10.7, -148.5),
                    CenterLatitude = 10.5,
                    CenterLongitude = -149.0,
                    AreaSizeKm2 = 23000,
                    Category = "N/A"
                }
            );

            // New blocks for the new areas
            context.ContractorAreaBlocks.AddRange(
                // Mid-Atlantic Ridge blocks
                new ContractorAreaBlock { 
                    BlockId = 6, 
                    AreaId = 6, 
                    BlockName = "TAG Hydrothermal Field", 
                    BlockDescription = "Active hydrothermal vent field", 
                    Status = "Active",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(26.0, -44.9, 26.3, -44.6),
                    CenterLatitude = 26.15,
                    CenterLongitude = -44.75,
                    AreaSizeKm2 = 3000,
                    Category = "N/A"
                },
                new ContractorAreaBlock { 
                    BlockId = 7, 
                    AreaId = 6, 
                    BlockName = "Lucky Strike", 
                    BlockDescription = "Large seamount with hydrothermal activity", 
                    Status = "Active",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(27.2, -44.7, 27.5, -44.4),
                    CenterLatitude = 27.35,
                    CenterLongitude = -44.55,
                    AreaSizeKm2 = 3500,
                    Category = "N/A"
                },
                // Indian Ocean blocks
                new ContractorAreaBlock { 
                    BlockId = 8, 
                    AreaId = 7, 
                    BlockName = "Kairei Field", 
                    BlockDescription = "Deep-sea hydrothermal field", 
                    Status = "Active",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(-10.2, 65.8, -9.8, 66.3),
                    CenterLatitude = -10.0,
                    CenterLongitude = 66.05,
                    AreaSizeKm2 = 2500,
                    Category = "N/A"
                },
                new ContractorAreaBlock { 
                    BlockId = 9, 
                    AreaId = 7, 
                    BlockName = "Edmond Field", 
                    BlockDescription = "Sulfide-rich hydrothermal area", 
                    Status = "Active",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(-9.5, 67.0, -9.0, 67.5),
                    CenterLatitude = -9.25,
                    CenterLongitude = 67.25,
                    AreaSizeKm2 = 2800,
                    Category = "N/A"
                },
                // Western Pacific blocks
                new ContractorAreaBlock { 
                    BlockId = 10, 
                    AreaId = 8, 
                    BlockName = "Magellan Seamount", 
                    BlockDescription = "Cobalt-rich seamount", 
                    Status = "Active",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(15.8, 156.2, 16.3, 156.7),
                    CenterLatitude = 16.05,
                    CenterLongitude = 156.45,
                    AreaSizeKm2 = 3200,
                    Category = "N/A"
                },
                new ContractorAreaBlock { 
                    BlockId = 11, 
                    AreaId = 8, 
                    BlockName = "Wake Seamount", 
                    BlockDescription = "Ferromanganese crust deposit area", 
                    Status = "Active",
                    GeoJsonBoundary = GeoJsonHelper.GenerateRectangleGeoJson(16.7, 157.2, 17.2, 157.7),
                    CenterLatitude = 16.95,
                    CenterLongitude = 157.45,
                    AreaSizeKm2 = 3500,
                    Category = "N/A"
                }
            );

            // --- Seed Cruises ---
            // Original cruises
            context.Cruises.AddRange(
                new Cruise { CruiseId = 1, ContractorId = 1, CruiseName = "BIONOD12_1", ResearchVessel = "Sonne", StartDate = new DateTime(2012, 4, 2), EndDate = new DateTime(2012, 4, 12) },
                new Cruise { CruiseId = 2, ContractorId = 2, CruiseName = "DY2008_DY115_20_1", ResearchVessel = "Dayang Yihao", StartDate = new DateTime(2008, 1, 1), EndDate = new DateTime(2008, 12, 31) },
                new Cruise { CruiseId = 3, ContractorId = 2, CruiseName = "DY2008_DY115_20_2", ResearchVessel = "Dayang Yihao", StartDate = new DateTime(2008, 1, 1), EndDate = new DateTime(2008, 12, 31) },
                new Cruise { CruiseId = 4, ContractorId = 2, CruiseName = "DY2009_DY115_21_1", ResearchVessel = "Dayang Yihao", StartDate = new DateTime(2009, 11, 1), EndDate = new DateTime(2009, 12, 31) },
                new Cruise { CruiseId = 5, ContractorId = 2, CruiseName = "DY2009_DY115_21_2", ResearchVessel = "Dayang Yihao", StartDate = new DateTime(2009, 11, 1), EndDate = new DateTime(2009, 12, 31) },
                new Cruise { CruiseId = 6, ContractorId = 2, CruiseName = "DY2011_DY125_22_9", ResearchVessel = "Dayang Yihao", StartDate = new DateTime(2011, 11, 10), EndDate = new DateTime(2011, 11, 13) },
                new Cruise { CruiseId = 7, ContractorId = 2, CruiseName = "DY73_I", ResearchVessel = "Dayang Yihao", StartDate = new DateTime(2022, 9, 3), EndDate = new DateTime(2022, 10, 2) },
                new Cruise { CruiseId = 8, ContractorId = 2, CruiseName = "DY73_II", ResearchVessel = "Dayang Yihao", StartDate = new DateTime(2022, 10, 4), EndDate = new DateTime(2022, 10, 6) },
                new Cruise { CruiseId = 9, ContractorId = 2, CruiseName = "DY79_II", ResearchVessel = "Dayang Yihao", StartDate = new DateTime(2023, 10, 12), EndDate = new DateTime(2023, 10, 19) },
                new Cruise { CruiseId = 10, ContractorId = 5, CruiseName = "FY2015_1", ResearchVessel = "Hakurei Maru", StartDate = new DateTime(2015, 6, 1), EndDate = new DateTime(2015, 6, 30) },
                new Cruise { CruiseId = 11, ContractorId = 4, CruiseName = "DY69_1", ResearchVessel = "Dayang Yihao", StartDate = new DateTime(2021, 10, 9), EndDate = new DateTime(2021, 10, 29) },
                new Cruise { CruiseId = 12, ContractorId = 3, CruiseName = "DY79_I", ResearchVessel = "Dayang Yihao", StartDate = new DateTime(2023, 8, 28), EndDate = new DateTime(2023, 10, 8) },
                new Cruise { CruiseId = 13, ContractorId = 3, CruiseName = "DY2021_DY70_I", ResearchVessel = "Dayang Yihao", StartDate = new DateTime(2021, 10, 23), EndDate = new DateTime(2021, 11, 10) },
                new Cruise { CruiseId = 14, ContractorId = 3, CruiseName = "DY2022_DY73_I", ResearchVessel = "Dayang Yihao", StartDate = new DateTime(2022, 9, 3), EndDate = new DateTime(2022, 9, 4) }
            );

            // New cruises for the new contractors
            context.Cruises.AddRange(
                // Mid-Atlantic Ridge cruises
                new Cruise { 
                    CruiseId = 15, 
                    ContractorId = 6, 
                    CruiseName = "MAR-2018-01", 
                    ResearchVessel = "Pourquoi Pas?", 
                    StartDate = new DateTime(2018, 5, 15), 
                    EndDate = new DateTime(2018, 6, 28) 
                },
                new Cruise { 
                    CruiseId = 16, 
                    ContractorId = 6, 
                    CruiseName = "MAR-2020-02", 
                    ResearchVessel = "Pourquoi Pas?", 
                    StartDate = new DateTime(2020, 7, 10), 
                    EndDate = new DateTime(2020, 8, 25) 
                },
                new Cruise { 
                    CruiseId = 17, 
                    ContractorId = 6, 
                    CruiseName = "MAR-2023-03", 
                    ResearchVessel = "L'Atalante", 
                    StartDate = new DateTime(2023, 6, 5), 
                    EndDate = new DateTime(2023, 7, 22) 
                },
                
                // Indian Ocean cruises
                new Cruise { 
                    CruiseId = 18, 
                    ContractorId = 7, 
                    CruiseName = "CIR-2017-01", 
                    ResearchVessel = "Sagar Nidhi", 
                    StartDate = new DateTime(2017, 3, 14), 
                    EndDate = new DateTime(2017, 4, 20) 
                },
                new Cruise { 
                    CruiseId = 19, 
                    ContractorId = 7, 
                    CruiseName = "CIR-2019-02", 
                    ResearchVessel = "Sagar Nidhi", 
                    StartDate = new DateTime(2019, 11, 5), 
                    EndDate = new DateTime(2019, 12, 10) 
                },
                new Cruise { 
                    CruiseId = 20, 
                    ContractorId = 7, 
                    CruiseName = "CIR-2022-03", 
                    ResearchVessel = "Sagar Kanya", 
                    StartDate = new DateTime(2022, 2, 8), 
                    EndDate = new DateTime(2022, 3, 17) 
                },
                
                // Western Pacific cruises
                new Cruise { 
                    CruiseId = 21, 
                    ContractorId = 8, 
                    CruiseName = "WP-2019-01", 
                    ResearchVessel = "Onnuri", 
                    StartDate = new DateTime(2019, 8, 22), 
                    EndDate = new DateTime(2019, 10, 5) 
                },
                new Cruise { 
                    CruiseId = 22, 
                    ContractorId = 8, 
                    CruiseName = "WP-2021-02", 
                    ResearchVessel = "Onnuri", 
                    StartDate = new DateTime(2021, 5, 10), 
                    EndDate = new DateTime(2021, 6, 25) 
                },
                new Cruise { 
                    CruiseId = 23, 
                    ContractorId = 8, 
                    CruiseName = "WP-2023-03", 
                    ResearchVessel = "Onnuri", 
                    StartDate = new DateTime(2023, 4, 17), 
                    EndDate = new DateTime(2023, 6, 3) 
                }
            );

            // --- Seed Stations ---
            // Original stations
            context.Stations.AddRange(
                new Station { StationId = 1, CruiseId = 1, StationCode = "Bio12-48SC", StationType = "CTD Station", Latitude = 11.7897, Longitude = -117.5983 },
                new Station { StationId = 2, CruiseId = 10, StationCode = "15MNRO09 St.W", StationType = "CTD Station", Latitude = 10.50071667, Longitude = -149.00248333 },
                new Station { StationId = 3, CruiseId = 10, StationCode = "15MNRO10 St.C", StationType = "CTD Station", Latitude = 10.50000000, Longitude = -149.00000000 },
                new Station { StationId = 4, CruiseId = 12, StationCode = "DY79I-KW1-CTD01", StationType = "CTD Station", Latitude = 10.003132, Longitude = -154.012328 }
            );

            // New stations for the new cruises
            context.Stations.AddRange(
                // Mid-Atlantic Ridge stations
                new Station { 
                    StationId = 5, 
                    CruiseId = 15, 
                    StationCode = "MAR-18-001", 
                    StationType = "Sampling Station", 
                    Latitude = 26.13642, 
                    Longitude = -44.83275 
                },
                new Station { 
                    StationId = 6, 
                    CruiseId = 15, 
                    StationCode = "MAR-18-002", 
                    StationType = "CTD Station", 
                    Latitude = 26.14789, 
                    Longitude = -44.82436 
                },
                new Station { 
                    StationId = 7, 
                    CruiseId = 16, 
                    StationCode = "MAR-20-015", 
                    StationType = "ROV Dive", 
                    Latitude = 27.36482, 
                    Longitude = -44.52837 
                },
                new Station { 
                    StationId = 8, 
                    CruiseId = 17, 
                    StationCode = "MAR-23-009", 
                    StationType = "Biological Sampling", 
                    Latitude = 26.09752, 
                    Longitude = -44.85231 
                },
                
                // Indian Ocean stations
                new Station { 
                    StationId = 9, 
                    CruiseId = 18, 
                    StationCode = "CIR-17-001", 
                    StationType = "CTD Station", 
                    Latitude = -10.02431, 
                    Longitude = 66.0786 
                },
                new Station { 
                    StationId = 10, 
                    CruiseId = 18, 
                    StationCode = "CIR-17-002", 
                    StationType = "Hydrothermal Survey", 
                    Latitude = -10.04256, 
                    Longitude = 66.09327 
                },
                new Station { 
                    StationId = 11, 
                    CruiseId = 19, 
                    StationCode = "CIR-19-008", 
                    StationType = "AUV Survey", 
                    Latitude = -9.23854, 
                    Longitude = 67.28976 
                },
                new Station { 
                    StationId = 12, 
                    CruiseId = 20, 
                    StationCode = "CIR-22-005", 
                    StationType = "ROV Dive", 
                    Latitude = -9.98765, 
                    Longitude = 66.12346 
                },
                
                // Western Pacific stations
                new Station { 
                    StationId = 13, 
                    CruiseId = 21, 
                    StationCode = "WP-19-001", 
                    StationType = "Dredge", 
                    Latitude = 16.10324, 
                    Longitude = 156.48712 
                },
                new Station { 
                    StationId = 14, 
                    CruiseId = 21, 
                    StationCode = "WP-19-002", 
                    StationType = "CTD Station", 
                    Latitude = 16.09875, 
                    Longitude = 156.42389 
                },
                new Station { 
                    StationId = 15, 
                    CruiseId = 22, 
                    StationCode = "WP-21-010", 
                    StationType = "Box Corer", 
                    Latitude = 16.97654, 
                    Longitude = 157.43287 
                },
                new Station { 
                    StationId = 16, 
                    CruiseId = 23, 
                    StationCode = "WP-23-007", 
                    StationType = "Multicore", 
                    Latitude = 16.03421, 
                    Longitude = 156.50875 
                }
            );

            // --- Seed Samples ---
            // Original samples
            context.Samples.AddRange(
                new Sample { SampleId = 1, StationId = 1, SampleCode = "Bio12-48SC", SampleType = "Water", MatrixType = "Seawater", HabitatType = "Water Column", SamplingDevice = "CTD Rosette", DepthLower = 4.0, DepthUpper = 4.01, SampleDescription = "Surface water sample" },
                new Sample { SampleId = 2, StationId = 2, SampleCode = "DOR31", SampleType = "Water", MatrixType = "Seawater", HabitatType = "Water Column", SamplingDevice = "CTD Rosette", DepthLower = 0.0, DepthUpper = 0.01, SampleDescription = "Surface water sample" },
                new Sample { SampleId = 3, StationId = 2, SampleCode = "DOR32", SampleType = "Water", MatrixType = "Seawater", HabitatType = "Water Column", SamplingDevice = "CTD Rosette", DepthLower = 0.0, DepthUpper = 0.01, SampleDescription = "Duplicate surface water sample" },
                new Sample { SampleId = 4, StationId = 4, SampleCode = "DY79I-KW1-CTD01-01", SampleType = "Water", MatrixType = "Seawater", HabitatType = "Water Column", SamplingDevice = "CTD Rosette", DepthLower = 5.0, DepthUpper = 5.01, SampleDescription = "Near-surface water sample" },
                new Sample { SampleId = 5, StationId = 4, SampleCode = "DY79I-KW1-CTD01-03", SampleType = "Water", MatrixType = "Seawater", HabitatType = "Water Column", SamplingDevice = "CTD Rosette", DepthLower = 125.0, DepthUpper = 125.01, SampleDescription = "Mid-depth water sample" }
            );

            // New samples for the new stations
            context.Samples.AddRange(
                // Mid-Atlantic Ridge samples
                new Sample { 
                    SampleId = 6, 
                    StationId = 5, 
                    SampleCode = "MAR18-001-01", 
                    SampleType = "Rock", 
                    MatrixType = "Sulfide", 
                    HabitatType = "Hydrothermal Vent", 
                    SamplingDevice = "ROV Manipulator", 
                    DepthLower = 3400.0, 
                    DepthUpper = 3400.1, 
                    SampleDescription = "Black smoker chimney fragment" 
                },
                new Sample { 
                    SampleId = 7, 
                    StationId = 6, 
                    SampleCode = "MAR18-002-CTD", 
                    SampleType = "Water", 
                    MatrixType = "Seawater", 
                    HabitatType = "Water Column", 
                    SamplingDevice = "CTD Rosette", 
                    DepthLower = 10.0, 
                    DepthUpper = 10.01, 
                    SampleDescription = "Near-surface water sample" 
                },
                new Sample { 
                    SampleId = 8, 
                    StationId = 6, 
                    SampleCode = "MAR18-002-CTD2", 
                    SampleType = "Water", 
                    MatrixType = "Seawater", 
                    HabitatType = "Water Column", 
                    SamplingDevice = "CTD Rosette", 
                    DepthLower = 2000.0, 
                    DepthUpper = 2000.01, 
                    SampleDescription = "Deep water sample" 
                },
                new Sample { 
                    SampleId = 9, 
                    StationId = 7, 
                    SampleCode = "MAR20-015-R1", 
                    SampleType = "Sediment", 
                    MatrixType = "Metalliferous Sediment", 
                    HabitatType = "Seafloor", 
                    SamplingDevice = "Push Core", 
                    DepthLower = 3520.0, 
                    DepthUpper = 3520.1, 
                    SampleDescription = "Oxidized surface sediment" 
                },
                
                // Indian Ocean samples
                new Sample { 
                    SampleId = 10, 
                    StationId = 9, 
                    SampleCode = "CIR17-001-W1", 
                    SampleType = "Water", 
                    MatrixType = "Seawater", 
                    HabitatType = "Water Column", 
                    SamplingDevice = "CTD Rosette", 
                    DepthLower = 5.0, 
                    DepthUpper = 5.01, 
                    SampleDescription = "Surface water sample" 
                },
                new Sample { 
                    SampleId = 11, 
                    StationId = 10, 
                    SampleCode = "CIR17-002-R1", 
                    SampleType = "Rock", 
                    MatrixType = "Basalt", 
                    HabitatType = "Seafloor", 
                    SamplingDevice = "Dredge", 
                    DepthLower = 3100.0, 
                    DepthUpper = 3100.1, 
                    SampleDescription = "Fresh basalt with glass rim" 
                },
                new Sample { 
                    SampleId = 12, 
                    StationId = 11, 
                    SampleCode = "CIR19-008-S1", 
                    SampleType = "Sediment", 
                    MatrixType = "Pelagic Sediment", 
                    HabitatType = "Seafloor", 
                    SamplingDevice = "Multicore", 
                    DepthLower = 3450.0, 
                    DepthUpper = 3450.1, 
                    SampleDescription = "Surface sediment, brown color" 
                },
                
                // Western Pacific samples
                new Sample { 
                    SampleId = 13, 
                    StationId = 13, 
                    SampleCode = "WP19-001-D1", 
                    SampleType = "Rock", 
                    MatrixType = "Fe-Mn Crust", 
                    HabitatType = "Seamount", 
                    SamplingDevice = "Dredge", 
                    DepthLower = 1800.0, 
                    DepthUpper = 1800.1, 
                    SampleDescription = "Ferromanganese crust, 4cm thickness" 
                },
                new Sample { 
                    SampleId = 14, 
                    StationId = 14, 
                    SampleCode = "WP19-002-W1", 
                    SampleType = "Water", 
                    MatrixType = "Seawater", 
                    HabitatType = "Water Column", 
                    SamplingDevice = "CTD Rosette", 
                    DepthLower = 10.0, 
                    DepthUpper = 10.01, 
                    SampleDescription = "Surface water sample" 
                },
                new Sample { 
                    SampleId = 15, 
                    StationId = 15, 
                    SampleCode = "WP21-010-BC", 
                    SampleType = "Sediment", 
                    MatrixType = "Calcareous Ooze", 
                    HabitatType = "Seafloor", 
                    SamplingDevice = "Box Corer", 
                    DepthLower = 2200.0, 
                    DepthUpper = 2200.1, 
                    SampleDescription = "Surface sediment sample" 
                }
            );

            // --- Seed CTD Data ---
            context.CtdDataSet.AddRange(
                // Original CTD data
                new CTDData { CtdId = 1, StationId = 1, DepthM = 4.0, TemperatureC = 27.14, Salinity = 34.28, Oxygen = 5.85, Ph = 8.1, MeasurementTime = new DateTime(2012, 4, 3, 10, 15, 0) },
                new CTDData { CtdId = 2, StationId = 2, DepthM = 0.0, TemperatureC = 26.89, Salinity = 35.12, Oxygen = 5.92, Ph = 8.2, MeasurementTime = new DateTime(2015, 6, 12, 8, 30, 0) },
                
                // New CTD data for Atlantic stations
                new CTDData { CtdId = 3, StationId = 6, DepthM = 10.0, TemperatureC = 22.45, Salinity = 36.23, Oxygen = 5.65, Ph = 8.05, MeasurementTime = new DateTime(2018, 5, 20, 9, 45, 0) },
                new CTDData { CtdId = 4, StationId = 6, DepthM = 500.0, TemperatureC = 10.82, Salinity = 35.25, Oxygen = 3.86, Ph = 7.92, MeasurementTime = new DateTime(2018, 5, 20, 10, 30, 0) },
                new CTDData { CtdId = 5, StationId = 6, DepthM = 2000.0, TemperatureC = 3.65, Salinity = 34.96, Oxygen = 4.25, Ph = 7.85, MeasurementTime = new DateTime(2018, 5, 20, 12, 15, 0) },
                
                // New CTD data for Indian Ocean stations
                new CTDData { CtdId = 6, StationId = 9, DepthM = 5.0, TemperatureC = 28.34, Salinity = 35.05, Oxygen = 5.45, Ph = 8.12, MeasurementTime = new DateTime(2017, 3, 18, 7, 20, 0) },
                new CTDData { CtdId = 7, StationId = 9, DepthM = 1000.0, TemperatureC = 7.26, Salinity = 34.78, Oxygen = 2.85, Ph = 7.76, MeasurementTime = new DateTime(2017, 3, 18, 9, 15, 0) },
                
                // New CTD data for Pacific stations
                new CTDData { CtdId = 8, StationId = 14, DepthM = 10.0, TemperatureC = 26.52, Salinity = 34.89, Oxygen = 5.72, Ph = 8.15, MeasurementTime = new DateTime(2019, 8, 29, 11, 5, 0) },
                new CTDData { CtdId = 9, StationId = 14, DepthM = 800.0, TemperatureC = 6.18, Salinity = 34.45, Oxygen = 3.12, Ph = 7.82, MeasurementTime = new DateTime(2019, 8, 29, 12, 50, 0) }
            );

            // --- Seed PhotoVideos ---
            // Original data
            context.PhotoVideos.AddRange(
                new PhotoVideo { MediaId = 1, SampleId = 1, FileName = "photo1.jpg", MediaType = "Photo", CameraSpecs = "GoPro", CaptureDate = new DateTime(2023, 1, 11), Remarks = "Clear water conditions" },
                new PhotoVideo { MediaId = 2, SampleId = 2, FileName = "video1.mp4", MediaType = "Video", CameraSpecs = "Underwater Cam", CaptureDate = new DateTime(2022, 5, 16), Remarks = "Sediment sampling in progress" }
            );

            // New media for new samples
            context.PhotoVideos.AddRange(
                // Mid-Atlantic Ridge photos/videos
                new PhotoVideo { 
                    MediaId = 3, 
                    SampleId = 6, 
                    FileName = "MAR18_chimney1.jpg", 
                    MediaType = "Photo", 
                    CameraSpecs = "Canon EOS 5D Mark IV", 
                    CaptureDate = new DateTime(2018, 5, 18), 
                    Remarks = "Close-up of black smoker chimney" 
                },
                new PhotoVideo { 
                    MediaId = 4, 
                    SampleId = 6, 
                    FileName = "MAR18_vent_community.mp4", 
                    MediaType = "Video", 
                    CameraSpecs = "ROV Victor 6000 4K Camera", 
                    CaptureDate = new DateTime(2018, 5, 18), 
                    Remarks = "Video of vent community surrounding black smoker" 
                },
                
                // Indian Ocean photos/videos
                new PhotoVideo { 
                    MediaId = 5, 
                    SampleId = 11, 
                    FileName = "CIR17_basalt.jpg", 
                    MediaType = "Photo", 
                    CameraSpecs = "Nikon D850", 
                    CaptureDate = new DateTime(2017, 3, 22), 
                    Remarks = "Fresh basalt sample with glass rim" 
                },
                
                // Western Pacific photos/videos
                new PhotoVideo { 
                    MediaId = 6, 
                    SampleId = 13, 
                    FileName = "WP19_FeMnCrust.jpg", 
                    MediaType = "Photo", 
                    CameraSpecs = "Sony Alpha a7 III", 
                    CaptureDate = new DateTime(2019, 8, 25), 
                    Remarks = "Cross-section of ferromanganese crust sample" 
                },
                new PhotoVideo { 
                    MediaId = 7, 
                    SampleId = 13, 
                    FileName = "WP19_seamount_dredge.mp4", 
                    MediaType = "Video", 
                    CameraSpecs = "Deep-sea Camera System", 
                    CaptureDate = new DateTime(2019, 8, 25), 
                    Remarks = "Video of dredge retrieval with Fe-Mn crusts" 
                }
            );

            // --- Seed EnvResults ---
            // Original data
            context.EnvResults.AddRange(
                new EnvResult { EnvResultId = 1, SampleId = 1, AnalysisCategory = "Water Properties", AnalysisName = "Water Temperature", AnalysisValue = 27.1419, Units = "°C", Remarks = "" },
                new EnvResult { EnvResultId = 2, SampleId = 1, AnalysisCategory = "Water Properties", AnalysisName = "Salinity", AnalysisValue = 34.2873, Units = "psu", Remarks = "" },
                new EnvResult { EnvResultId = 3, SampleId = 1, AnalysisCategory = "Water Properties", AnalysisName = "Chlorophyll a", AnalysisValue = 0.169, Units = "mg/m³", Remarks = "" },
                new EnvResult { EnvResultId = 4, SampleId = 2, AnalysisCategory = "Nutrients", AnalysisName = "Nitrite (NO₂-N)", AnalysisValue = 0.001, Units = "mg/L", Remarks = "" },
                new EnvResult { EnvResultId = 5, SampleId = 5, AnalysisCategory = "Water Properties", AnalysisName = "Dissolved oxygen (DO)", AnalysisValue = 6.41, Units = "mg/L", Remarks = "" },
                new EnvResult { EnvResultId = 6, SampleId = 5, AnalysisCategory = "Water Properties", AnalysisName = "pH", AnalysisValue = 7.8, Units = "", Remarks = "" }
            );

            // New environmental results
            context.EnvResults.AddRange(
                // Mid-Atlantic Ridge environmental data
                new EnvResult { 
                    EnvResultId = 7, 
                    SampleId = 7, 
                    AnalysisCategory = "Water Properties", 
                    AnalysisName = "Water Temperature", 
                    AnalysisValue = 22.45, 
                    Units = "°C", 
                    Remarks = "Measured with CTD sensor" 
                },
                new EnvResult { 
                    EnvResultId = 8, 
                    SampleId = 7, 
                    AnalysisCategory = "Water Properties", 
                    AnalysisName = "Salinity", 
                    AnalysisValue = 36.23, 
                    Units = "psu", 
                    Remarks = "Measured with CTD sensor" 
                },
                new EnvResult { 
                    EnvResultId = 9, 
                    SampleId = 7, 
                    AnalysisCategory = "Nutrients", 
                    AnalysisName = "Phosphate (PO₄³⁻)", 
                    AnalysisValue = 0.23, 
                    Units = "μmol/L", 
                    Remarks = "Analyzed using colorimetric method" 
                },
                
                // Indian Ocean environmental data
                new EnvResult { 
                    EnvResultId = 10, 
                    SampleId = 10, 
                    AnalysisCategory = "Water Properties", 
                    AnalysisName = "Water Temperature", 
                    AnalysisValue = 28.34, 
                    Units = "°C", 
                    Remarks = "Measured with CTD sensor" 
                },
                new EnvResult { 
                    EnvResultId = 11, 
                    SampleId = 10, 
                    AnalysisCategory = "Water Properties", 
                    AnalysisName = "Turbidity", 
                    AnalysisValue = 0.32, 
                    Units = "NTU", 
                    Remarks = "Measured with CTD-mounted turbidity sensor" 
                },
                
                // Western Pacific environmental data
                new EnvResult { 
                    EnvResultId = 12, 
                    SampleId = 14, 
                    AnalysisCategory = "Water Properties", 
                    AnalysisName = "Water Temperature", 
                    AnalysisValue = 26.52, 
                    Units = "°C", 
                    Remarks = "Measured with CTD sensor" 
                },
                new EnvResult { 
                    EnvResultId = 13, 
                    SampleId = 14, 
                    AnalysisCategory = "Nutrients", 
                    AnalysisName = "Silicate (SiO₄⁴⁻)", 
                    AnalysisValue = 2.85, 
                    Units = "μmol/L", 
                    Remarks = "Analyzed using colorimetric method" 
                }
            );

            // --- Seed GeoResults ---
            context.GeoResults.AddRange(
                // Mid-Atlantic Ridge geological data
                new GeoResult { 
                    GeoResultId = 1, 
                    SampleId = 6, 
                    Category = "Mineral Composition", 
                    Analysis = "Copper", 
                    Value = 15.8, 
                    Units = "wt%", 
                    Qualifier = "Measured", 
                    Remarks = "XRF analysis" 
                },
                new GeoResult { 
                    GeoResultId = 2, 
                    SampleId = 6, 
                    Category = "Mineral Composition", 
                    Analysis = "Zinc", 
                    Value = 8.3, 
                    Units = "wt%", 
                    Qualifier = "Measured", 
                    Remarks = "XRF analysis" 
                },
                new GeoResult { 
                    GeoResultId = 3, 
                    SampleId = 6, 
                    Category = "Mineral Composition", 
                    Analysis = "Iron", 
                    Value = 28.6, 
                    Units = "wt%", 
                    Qualifier = "Measured", 
                    Remarks = "XRF analysis" 
                },
                
                // Indian Ocean geological data
                new GeoResult { 
                    GeoResultId = 4, 
                    SampleId = 11, 
                    Category = "Mineral Composition", 
                    Analysis = "Silicon Dioxide", 
                    Value = 49.8, 
                    Units = "wt%", 
                    Qualifier = "Measured", 
                    Remarks = "XRF analysis" 
                },
                new GeoResult { 
                    GeoResultId = 5, 
                    SampleId = 11, 
                    Category = "Mineral Composition", 
                    Analysis = "Aluminum Oxide", 
                    Value = 14.2, 
                    Units = "wt%", 
                    Qualifier = "Measured", 
                    Remarks = "XRF analysis" 
                },
                
                // Western Pacific geological data
                new GeoResult { 
                    GeoResultId = 6, 
                    SampleId = 13, 
                    Category = "Mineral Composition", 
                    Analysis = "Cobalt", 
                    Value = 0.68, 
                    Units = "wt%", 
                    Qualifier = "Measured", 
                    Remarks = "ICP-MS analysis" 
                },
                new GeoResult { 
                    GeoResultId = 7, 
                    SampleId = 13, 
                    Category = "Mineral Composition", 
                    Analysis = "Manganese", 
                    Value = 18.35, 
                    Units = "wt%", 
                    Qualifier = "Measured", 
                    Remarks = "ICP-MS analysis" 
                },
                new GeoResult { 
                    GeoResultId = 8, 
                    SampleId = 13, 
                    Category = "Mineral Composition", 
                    Analysis = "Nickel", 
                    Value = 0.43, 
                    Units = "wt%", 
                    Qualifier = "Measured", 
                    Remarks = "ICP-MS analysis" 
                }
            );

            // --- Seed Libraries (documents) ---
            context.Libraries.AddRange(
                // Mid-Atlantic Ridge documents
                new Library { 
                    LibraryId = 1, 
                    ContractorId = 6, 
                    Theme = "Environmental Baseline", 
                    FileName = "MAR_Environmental_Baseline_2018.pdf", 
                    Title = "Environmental Baseline Study for the TAG Hydrothermal Field", 
                    Description = "Comprehensive description of the baseline environmental conditions at the TAG Hydrothermal Field exploration area", 
                    Year = 2023,
                    Country = "China",
                    SubmissionDate = new DateTime(2018, 12, 15), 
                    IsConfidential = false 
                },
                new Library { 
                    LibraryId = 2, 
                    ContractorId = 6, 
                    Theme = "Resource Assessment", 
                    FileName = "MAR_Mineral_Resource_Assessment_2020.pdf", 
                    Title = "Mineral Resource Assessment of Hydrothermal Deposits at the Mid-Atlantic Ridge", 
                    Description = "Technical report on the mineral potential of hydrothermal deposits in the exploration contract area", 
                    Year = 2022,
                    Country = "South-Korea",
                    SubmissionDate = new DateTime(2020, 9, 30), 
                    IsConfidential = true 
                },
                
                // Indian Ocean documents
                new Library { 
                    LibraryId = 3, 
                    ContractorId = 7, 
                    Theme = "Environmental Impact", 
                    FileName = "CIR_Environmental_Impact_Statement_2019.pdf", 
                    Title = "Environmental Impact Statement for Exploration Activities in the Central Indian Ridge", 
                    Description = "Assessment of potential environmental impacts from exploration activities", 
                    Year = 2024,
                    Country = "India",
                    SubmissionDate = new DateTime(2019, 5, 22), 
                    IsConfidential = false 
                },
                
                // Western Pacific documents
                new Library { 
                    LibraryId = 4, 
                    ContractorId = 8, 
                    Theme = "Resource Assessment", 
                    FileName = "WP_Crusts_Resource_Report_2021.pdf", 
                    Title = "Cobalt-rich Ferromanganese Crusts Resource Assessment", 
                    Description = "Technical assessment of cobalt-rich crust resources in the Western Pacific exploration area", 
                    Year = 2025,
                    Country = "USA",
                    SubmissionDate = new DateTime(2021, 8, 15), 
                    IsConfidential = true 
                },
                new Library { 
                    LibraryId = 5, 
                    ContractorId = 8, 
                    Theme = "Biodiversity", 
                    FileName = "WP_Seamount_Biodiversity_2022.pdf", 
                    Title = "Seamount Biodiversity Survey Results", 
                    Description = "Scientific report on the biodiversity observed on surveyed seamounts", 
                    Year = 2022,
                    Country = "USA",
                    SubmissionDate = new DateTime(2022, 2, 28), 
                    IsConfidential = false 
                }
            );

            // --- Seed Qualifiers ---
            context.Qualifiers.AddRange(
                new Qualifier { QualifierId = 1, QualifierCode = "M", QualifierDefinition = "Measured value" },
                new Qualifier { QualifierId = 2, QualifierCode = "E", QualifierDefinition = "Estimated value" },
                new Qualifier { QualifierId = 3, QualifierCode = "C", QualifierDefinition = "Calculated value" },
                new Qualifier { QualifierId = 4, QualifierCode = "BDL", QualifierDefinition = "Below detection limit" }
            );

            // --- Seed Valid Values ---
            context.ValidValues.AddRange(
                // Sample types
                new ValidValue { ValueId = 1, FieldName = "SampleType", ValidValueName = "Water", Description = "Water samples collected from the water column" },
                new ValidValue { ValueId = 2, FieldName = "SampleType", ValidValueName = "Rock", Description = "Rock samples from seafloor or outcrops" },
                new ValidValue { ValueId = 3, FieldName = "SampleType", ValidValueName = "Sediment", Description = "Sediment samples from seafloor" },
                new ValidValue { ValueId = 4, FieldName = "SampleType", ValidValueName = "Biological", Description = "Biological samples" },
                
                // Matrix types
                new ValidValue { ValueId = 5, FieldName = "MatrixType", ValidValueName = "Seawater", Description = "Seawater matrix" },
                new ValidValue { ValueId = 6, FieldName = "MatrixType", ValidValueName = "Sulfide", Description = "Sulfide mineral matrix" },
                new ValidValue { ValueId = 7, FieldName = "MatrixType", ValidValueName = "Basalt", Description = "Basaltic rock matrix" },
                new ValidValue { ValueId = 8, FieldName = "MatrixType", ValidValueName = "Fe-Mn Crust", Description = "Ferromanganese crust matrix" },
                new ValidValue { ValueId = 9, FieldName = "MatrixType", ValidValueName = "Pelagic Sediment", Description = "Pelagic sediment matrix" },
                new ValidValue { ValueId = 10, FieldName = "MatrixType", ValidValueName = "Metalliferous Sediment", Description = "Metalliferous sediment matrix" },
                new ValidValue { ValueId = 11, FieldName = "MatrixType", ValidValueName = "Calcareous Ooze", Description = "Calcareous ooze sediment matrix" },
                
                // Habitat types
                new ValidValue { ValueId = 12, FieldName = "HabitatType", ValidValueName = "Water Column", Description = "Open water habitat" },
                new ValidValue { ValueId = 13, FieldName = "HabitatType", ValidValueName = "Seafloor", Description = "General seafloor habitat" },
                new ValidValue { ValueId = 14, FieldName = "HabitatType", ValidValueName = "Hydrothermal Vent", Description = "Active hydrothermal vent habitat" },
                new ValidValue { ValueId = 15, FieldName = "HabitatType", ValidValueName = "Seamount", Description = "Seamount habitat" },
                
                new ValidValue { ValueId = 17, FieldName = "StationType", ValidValueName = "Sampling Station", Description = "General sampling station" },
                new ValidValue { ValueId = 18, FieldName = "StationType", ValidValueName = "ROV Dive", Description = "Station for ROV dive operations" },
                new ValidValue { ValueId = 19, FieldName = "StationType", ValidValueName = "Dredge", Description = "Station for dredge sampling" },
                new ValidValue { ValueId = 20, FieldName = "StationType", ValidValueName = "Box Corer", Description = "Station for box corer sampling" },
                new ValidValue { ValueId = 21, FieldName = "StationType", ValidValueName = "Multicore", Description = "Station for multicore sampling" },
                new ValidValue { ValueId = 22, FieldName = "StationType", ValidValueName = "AUV Survey", Description = "Station for AUV survey operations" },
                new ValidValue { ValueId = 23, FieldName = "StationType", ValidValueName = "Biological Sampling", Description = "Station for biological sampling" },
                
                // Sampling devices
                new ValidValue { ValueId = 24, FieldName = "SamplingDevice", ValidValueName = "CTD Rosette", Description = "Water sampling rosette with CTD" },
                new ValidValue { ValueId = 25, FieldName = "SamplingDevice", ValidValueName = "ROV Manipulator", Description = "Sampling using ROV manipulator arm" },
                new ValidValue { ValueId = 26, FieldName = "SamplingDevice", ValidValueName = "Dredge", Description = "Dredge sampling device" },
                new ValidValue { ValueId = 27, FieldName = "SamplingDevice", ValidValueName = "Box Corer", Description = "Box corer sampling device" },
                new ValidValue { ValueId = 28, FieldName = "SamplingDevice", ValidValueName = "Push Core", Description = "Push core sampling device" },
                new ValidValue { ValueId = 29, FieldName = "SamplingDevice", ValidValueName = "Multicore", Description = "Multicore sampling device" },
                
                // Media types
                new ValidValue { ValueId = 30, FieldName = "MediaType", ValidValueName = "Photo", Description = "Still photograph" },
                new ValidValue { ValueId = 31, FieldName = "MediaType", ValidValueName = "Video", Description = "Video recording" }
            );

            // Save all changes
            context.SaveChanges();
        }
    }
}
