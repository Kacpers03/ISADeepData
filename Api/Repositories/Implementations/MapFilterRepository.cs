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

        // Eksisterende metoder beholdes uendret

        public async Task<IEnumerable<ContractorDto>> GetContractorsAsync(int? contractTypeId = null, int? contractStatusId = null, 
            string sponsoringState = null, int? year = null)
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

        // Resten av de eksisterende metodene...
        
        // Ny analytisk metode
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
    }
}