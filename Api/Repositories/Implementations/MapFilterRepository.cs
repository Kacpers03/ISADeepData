using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Repositories.Interfaces;
using Models.Contractors;
using Models.Cruises;
using Models.Stations;
using Models.Samples;
using Models.Photo_Video;
using Models.Env_Result;
using Models.Geo_result;
using DTOs.Contractors_Dto;
using DTOs.Cruise_Dto;
using DTOs.Station_Dto;
using DTOs.Sample_Dto;
using DTOs.PhotoVideo_Dto;
using System.Linq;

namespace Api.Repositories.Implementations
{
    public class MapFilterRepository : IMapFilterRepository
    {
        private readonly MyDbContext _context;

        public MapFilterRepository(MyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ContractorDto>> GetContractorsAsync(int? contractTypeId = null, int? contractStatusId = null, 
            string? sponsoringState = null, int? year = null)
        {
            var query = _context.Contractors.AsQueryable();
            
            if (contractTypeId.HasValue)
            {
                query = query.Where(c => c.ContractTypeId == contractTypeId.Value);
            }
            
            if (contractStatusId.HasValue)
            {
                query = query.Where(c => c.ContractStatusId == contractStatusId.Value);
            }
            
            if (!string.IsNullOrWhiteSpace(sponsoringState))
            {
                query = query.Where(c => c.SponsoringState == sponsoringState);
            }
            
            if (year.HasValue)
            {
                query = query.Where(c => c.ContractualYear == year.Value);
            }

            return await query
                .Include(c => c.ContractType)
                .Include(c => c.ContractStatus)
                .Select(c => new ContractorDto
                {
                    ContractorId = c.ContractorId,
                    ContractorName = c.ContractorName,
                    ContractTypeId = c.ContractTypeId,
                    ContractStatusId = c.ContractStatusId,
                    ContractNumber = c.ContractNumber,
                    SponsoringState = c.SponsoringState,
                    ContractualYear = c.ContractualYear,
                    Remarks = c.Remarks
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ContractorAreaDto>> GetContractorAreasAsync(int? contractorId = null)
        {
            var query = _context.ContractorAreas.AsQueryable();
            
            if (contractorId.HasValue)
            {
                query = query.Where(a => a.ContractorId == contractorId.Value);
            }

            return await query
                .Select(a => new ContractorAreaDto
                {
                    AreaId = a.AreaId,
                    ContractorId = a.ContractorId,
                    AreaName = a.AreaName,
                    AreaDescription = a.AreaDescription
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ContractorAreaBlockDto>> GetContractorAreaBlocksAsync(int? areaId = null)
        {
            var query = _context.ContractorAreaBlocks.AsQueryable();
            
            if (areaId.HasValue)
            {
                query = query.Where(b => b.AreaId == areaId.Value);
            }

            return await query
                .Select(b => new ContractorAreaBlockDto
                {
                    BlockId = b.BlockId,
                    AreaId = b.AreaId,
                    BlockName = b.BlockName,
                    BlockDescription = b.BlockDescription,
                    Status = b.Status
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<CruiseDto>> GetCruisesAsync(int? contractorId = null)
        {
            var query = _context.Cruises.AsQueryable();
            
            if (contractorId.HasValue)
            {
                query = query.Where(c => c.ContractorId == contractorId.Value);
            }

            return await query
                .Select(c => new CruiseDto
                {
                    CruiseId = c.CruiseId,
                    ContractorId = c.ContractorId,
                    CruiseName = c.CruiseName,
                    ResearchVessel = c.ResearchVessel,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<StationDto>> GetStationsAsync(int? cruiseId = null, double? minLat = null, 
            double? maxLat = null, double? minLon = null, double? maxLon = null)
        {
            var query = _context.Stations.AsQueryable();
            
            if (cruiseId.HasValue)
            {
                query = query.Where(s => s.CruiseId == cruiseId.Value);
            }
            
            if (minLat.HasValue)
            {
                query = query.Where(s => s.Latitude >= minLat.Value);
            }
            
            if (maxLat.HasValue)
            {
                query = query.Where(s => s.Latitude <= maxLat.Value);
            }
            
            if (minLon.HasValue)
            {
                query = query.Where(s => s.Longitude >= minLon.Value);
            }
            
            if (maxLon.HasValue)
            {
                query = query.Where(s => s.Longitude <= maxLon.Value);
            }

            return await query
                .Select(s => new StationDto
                {
                    StationId = s.StationId,
                    CruiseId = s.CruiseId,
                    StationCode = s.StationCode,
                    StationType = s.StationType,
                    Latitude = s.Latitude,
                    Longitude = s.Longitude
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<SampleDto>> GetSamplesAsync(int? stationId = null, string? sampleType = null)
        {
            var query = _context.Samples.AsQueryable();
            
            if (stationId.HasValue)
            {
                query = query.Where(s => s.StationId == stationId.Value);
            }
            
            if (!string.IsNullOrWhiteSpace(sampleType))
            {
                query = query.Where(s => s.SampleType == sampleType);
            }

            return await query
                .Select(s => new SampleDto
                {
                    SampleId = s.SampleId,
                    StationId = s.StationId,
                    SampleCode = s.SampleCode,
                    SampleType = s.SampleType,
                    MatrixType = s.MatrixType,
                    HabitatType = s.HabitatType,
                    SamplingDevice = s.SamplingDevice,
                    DepthLower = s.DepthLower,
                    DepthUpper = s.DepthUpper,
                    SampleDescription = s.SampleDescription
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<PhotoVideoDto>> GetMediaAsync(int? sampleId = null, string? mediaType = null)
        {
            var query = _context.PhotoVideos.AsQueryable();
            
            if (sampleId.HasValue)
            {
                query = query.Where(p => p.SampleId == sampleId.Value);
            }
            
            if (!string.IsNullOrWhiteSpace(mediaType))
            {
                query = query.Where(p => p.MediaType == mediaType);
            }

            return await query
                .Select(p => new PhotoVideoDto
                {
                    MediaId = p.MediaId,
                    SampleId = p.SampleId,
                    FileName = p.FileName,
                    MediaType = p.MediaType,
                    CameraSpecs = p.CameraSpecs,
                    CaptureDate = p.CaptureDate,
                    Remarks = p.Remarks
                })
                .ToListAsync();
        }

        public async Task<object> GetMapDataAsync(int? contractorId = null, int? contractTypeId = null, 
            int? contractStatusId = null, string? sponsoringState = null, int? year = null, int? cruiseId = null)
        {
            // Start with contractors query
            var contractorsQuery = _context.Contractors.AsQueryable();
            
            if (contractorId.HasValue)
            {
                contractorsQuery = contractorsQuery.Where(c => c.ContractorId == contractorId.Value);
            }
            
            if (contractTypeId.HasValue)
            {
                contractorsQuery = contractorsQuery.Where(c => c.ContractTypeId == contractTypeId.Value);
            }
            
            if (contractStatusId.HasValue)
            {
                contractorsQuery = contractorsQuery.Where(c => c.ContractStatusId == contractStatusId.Value);
            }
            
            if (!string.IsNullOrWhiteSpace(sponsoringState))
            {
                contractorsQuery = contractorsQuery.Where(c => c.SponsoringState == sponsoringState);
            }
            
            if (year.HasValue)
            {
                contractorsQuery = contractorsQuery.Where(c => c.ContractualYear == year.Value);
            }

            // Get contractors with their related areas and blocks
            var contractors = await contractorsQuery
                .Include(c => c.ContractType)
                .Include(c => c.ContractStatus)
                .Include(c => c.ContractorAreas)
                .ThenInclude(a => a.ContractorAreaBlocks)
                .ToListAsync();

            var cruisesQuery = _context.Cruises.AsQueryable();
            
            if (cruiseId.HasValue)
            {
                cruisesQuery = cruisesQuery.Where(c => c.CruiseId == cruiseId.Value);
            }
            else if (contractorId.HasValue)
            {
                cruisesQuery = cruisesQuery.Where(c => c.ContractorId == contractorId.Value);
            }
            else if (contractors.Any())
            {
                var contractorIds = contractors.Select(c => c.ContractorId).ToList();
                cruisesQuery = cruisesQuery.Where(c => contractorIds.Contains(c.ContractorId));
            }

            // Get cruises with their stations
            var cruises = await cruisesQuery
                .Include(c => c.Stations)
                .ToListAsync();

            // Collect all stations for the selected cruises
            var stationIds = cruises.SelectMany(c => c.Stations.Select(s => s.StationId)).ToList();

            // Get all samples for these stations
            var samples = await _context.Samples
                .Where(s => stationIds.Contains(s.StationId))
                .ToListAsync();

            // Get all photos/videos for these samples
            var sampleIds = samples.Select(s => s.SampleId).ToList();
            var media = await _context.PhotoVideos
                .Where(p => sampleIds.Contains(p.SampleId))
                .ToListAsync();

            // Organize the data in a structured format
            var result = new
            {
                Contractors = contractors.Select(c => new 
                {
                    c.ContractorId,
                    c.ContractorName,
                    ContractType = c.ContractType.ContractTypeName,
                    ContractStatus = c.ContractStatus.ContractStatusName,
                    c.ContractNumber,
                    c.SponsoringState,
                    c.ContractualYear,
                    Areas = c.ContractorAreas.Select(a => new
                    {
                        a.AreaId,
                        a.AreaName,
                        a.AreaDescription,
                        Blocks = a.ContractorAreaBlocks.Select(b => new
                        {
                            b.BlockId,
                            b.BlockName,
                            b.BlockDescription,
                            b.Status
                        })
                    })
                }),
                Cruises = cruises.Select(c => new
                {
                    c.CruiseId,
                    c.CruiseName,
                    c.ResearchVessel,
                    c.StartDate,
                    c.EndDate,
                    Stations = c.Stations.Select(s => new
                    {
                        s.StationId,
                        s.StationCode,
                        s.StationType,
                        s.Latitude,
                        s.Longitude,
                        Samples = samples
                            .Where(sample => sample.StationId == s.StationId)
                            .Select(sample => new
                            {
                                sample.SampleId,
                                sample.SampleCode,
                                sample.SampleType,
                                sample.MatrixType,
                                sample.HabitatType,
                                sample.SamplingDevice,
                                sample.DepthLower,
                                sample.DepthUpper,
                                sample.SampleDescription,
                                Media = media
                                    .Where(m => m.SampleId == sample.SampleId)
                                    .Select(m => new
                                    {
                                        m.MediaId,
                                        m.FileName,
                                        m.MediaType,
                                        m.CameraSpecs,
                                        m.CaptureDate,
                                        m.Remarks
                                    })
                            })
                    })
                })
            };

            return result;
        }

        public async Task<IEnumerable<ContractTypeDto>> GetContractTypesAsync()
        {
            return await _context.ContractTypes
                .Select(t => new ContractTypeDto
                {
                    ContractTypeId = t.ContractTypeId,
                    ContractTypeName = t.ContractTypeName
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ContractStatusDto>> GetContractStatusesAsync()
        {
            return await _context.ContractStatuses
                .Select(s => new ContractStatusDto
                {
                    ContractStatusId = s.ContractStatusId,
                    ContractStatusName = s.ContractStatusName
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetSponsoringStatesAsync()
        {
            return await _context.Contractors
                .Select(c => c.SponsoringState)
                .Distinct()
                .ToListAsync();
        }

        public async Task<IEnumerable<int>> GetContractualYearsAsync()
        {
            return await _context.Contractors
                .Select(c => c.ContractualYear)
                .Distinct()
                .OrderByDescending(y => y)
                .ToListAsync();
        }
        
        public async Task<object> GetBlockAnalysisAsync(int blockId)
        {
            var block = await _context.ContractorAreaBlocks
                .Include(b => b.ContractorArea)
                .ThenInclude(a => a.Contractor)
                .FirstOrDefaultAsync(b => b.BlockId == blockId);
                
            if (block == null)
                return null;
                
            // Finn stasjoner innenfor blokken
            var stations = await _context.Stations
                .Where(s => s.ContractorAreaBlockId == blockId)
                .ToListAsync();
            
            // Finn alle prøver tatt ved disse stasjonene
            var stationIds = stations.Select(s => s.StationId).ToList();
            var samples = await _context.Samples
                .Include(s => s.Station)
                .Where(s => stationIds.Contains(s.StationId))
                .ToListAsync();
                
            // Samle analyse-resultater
            var sampleIds = samples.Select(s => s.SampleId).ToList();
            var envResults = await _context.EnvResults
                .Where(e => sampleIds.Contains(e.SampleId))
                .ToListAsync();
                
            var geoResults = await _context.GeoResults
                .Where(g => sampleIds.Contains(g.SampleId))
                .ToListAsync();
                
            // Beregn nøkkeltall
            var environmentalParameters = envResults
                .GroupBy(e => e.AnalysisCategory)
                .Select(g => new {
                    Category = g.Key,
                    Parameters = g.GroupBy(e => e.AnalysisName)
                        .Select(p => new {
                            Name = p.Key,
                            AverageValue = p.Average(r => r.AnalysisValue),
                            MinValue = p.Min(r => r.AnalysisValue),
                            MaxValue = p.Max(r => r.AnalysisValue),
                            Unit = p.First().Units,
                            Count = p.Count()
                        })
                        .ToList()
                })
                .ToList();
                
            var resourceMetrics = geoResults
                .GroupBy(g => g.Category)
                .Select(g => new {
                    Category = g.Key,
                    Analyses = g.GroupBy(a => a.Analysis)
                        .Select(a => new {
                            Analysis = a.Key,
                            AverageValue = a.Average(r => r.Value),
                            MinValue = a.Min(r => r.Value),
                            MaxValue = a.Max(r => r.Value),
                            Unit = a.First().Units,
                            Count = a.Count()
                        })
                        .ToList()
                })
                .ToList();
                
            // Samle data om prøvetypene
            var sampleTypes = samples
                .GroupBy(s => s.SampleType)
                .Select(g => new {
                    SampleType = g.Key,
                    Count = g.Count(),
                    DepthRange = new {
                        Min = g.Min(s => s.DepthLower),
                        Max = g.Max(s => s.DepthUpper)
                    }
                })
                .ToList();
                
            return new {
                Block = new {
                    block.BlockId,
                    block.BlockName,
                    block.Status,
                    block.AreaSizeKm2,
                    block.Category,
                    block.ResourceDensity,
                    block.EconomicValue,
                    Area = new {
                        block.ContractorArea.AreaId,
                        block.ContractorArea.AreaName,
                        Contractor = new {
                            block.ContractorArea.Contractor.ContractorId,
                            block.ContractorArea.Contractor.ContractorName
                        }
                    }
                },
                Counts = new {
                    Stations = stations.Count,
                    Samples = samples.Count,
                    EnvironmentalResults = envResults.Count,
                    GeologicalResults = geoResults.Count
                },
                EnvironmentalParameters = environmentalParameters,
                ResourceMetrics = resourceMetrics,
                SampleTypes = sampleTypes,
                RecentStations = stations
                    .OrderByDescending(s => s.StationId)
                    .Take(5)
                    .Select(s => new {
                        s.StationId,
                        s.StationCode,
                        s.StationType,
                        s.Latitude,
                        s.Longitude
                    })
                    .ToList()
            };
        }
    } //s
}