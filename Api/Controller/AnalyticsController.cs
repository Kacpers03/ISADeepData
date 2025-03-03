using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Services.Interfaces;
using Models.Env_Result;
using Models.Geo_result;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly ISpatialService _spatialService;
        private readonly IMapFilterService _mapFilterService;

        public AnalyticsController(
            MyDbContext context, 
            ISpatialService spatialService,
            IMapFilterService mapFilterService)
        {
            _context = context;
            _spatialService = spatialService;
            _mapFilterService = mapFilterService;
        }
        
        [HttpGet("block/{blockId}")]
        public async Task<ActionResult<object>> GetBlockAnalysis(int blockId)
        {
            var result = await _mapFilterService.GetBlockAnalysisAsync(blockId);
            
            if (result == null)
                return NotFound();
                
            return result;
        }
        
        [HttpGet("contractor/{contractorId}/summary")]
        public async Task<ActionResult<object>> GetContractorSummary(int contractorId)
        {
            // Sjekk om kontraktør eksisterer
            var contractor = await _context.Contractors
                .Include(c => c.ContractType)
                .Include(c => c.ContractStatus)
                .FirstOrDefaultAsync(c => c.ContractorId == contractorId);
                
            if (contractor == null)
                return NotFound();
                
            // Hent tilknyttede områder
            var areas = await _context.ContractorAreas
                .Where(a => a.ContractorId == contractorId)
                .ToListAsync();
                
            var areaIds = areas.Select(a => a.AreaId).ToList();
            
            // Hent tilknyttede blokker
            var blocks = await _context.ContractorAreaBlocks
                .Where(b => areaIds.Contains(b.AreaId))
                .ToListAsync();
                
            // Hent cruises
            var cruises = await _context.Cruises
                .Where(c => c.ContractorId == contractorId)
                .ToListAsync();
                
            var cruiseIds = cruises.Select(c => c.CruiseId).ToList();
            
            // Hent stasjoner
            var stations = await _context.Stations
                .Where(s => cruiseIds.Contains(s.CruiseId))
                .ToListAsync();
                
            var stationIds = stations.Select(s => s.StationId).ToList();
            
            // Hent prøver
            var samples = await _context.Samples
                .Where(s => stationIds.Contains(s.StationId))
                .ToListAsync();
                
            // Beregn statistikk
            var totalAreaKm2 = blocks.Sum(b => b.AreaSizeKm2);
            var earliestCruise = cruises.Any() ? cruises.Min(c => c.StartDate) : DateTime.MinValue;
            var latestCruise = cruises.Any() ? cruises.Max(c => c.EndDate) : DateTime.MinValue;
            
            // Returnér samlet informasjon
            return new
            {
                Contractor = new
                {
                    contractor.ContractorId,
                    contractor.ContractorName,
                    ContractType = contractor.ContractType?.ContractTypeName,
                    Status = contractor.ContractStatus?.ContractStatusName,
                    contractor.SponsoringState,
                    contractor.ContractualYear,
                    ContractDuration = DateTime.Now.Year - contractor.ContractualYear
                },
                Summary = new
                {
                    TotalAreas = areas.Count,
                    TotalBlocks = blocks.Count,
                    TotalAreaKm2 = totalAreaKm2,
                    TotalCruises = cruises.Count,
                    TotalStations = stations.Count,
                    TotalSamples = samples.Count,
                    EarliestCruise = earliestCruise,
                    LatestCruise = latestCruise,
                    ExpeditionDays = cruises.Sum(c => (c.EndDate - c.StartDate).Days + 1)
                },
                Areas = areas.Select(a => new
                {
                    a.AreaId,
                    a.AreaName,
                    a.TotalAreaSizeKm2,
                    BlockCount = blocks.Count(b => b.AreaId == a.AreaId)
                }).ToList()
            };
        }
        
        [HttpPost("associate-stations-blocks")]
        public async Task<ActionResult<object>> AssociateStationsWithBlocks()
        {
            try
            {
                var result = await _spatialService.AssociateStationsWithBlocks();
                
                if (result)
                {
                    return Ok(new { message = "Stasjoner er nå koblet til blokker basert på geografiske koordinater" });
                }
                else
                {
                    return BadRequest(new { message = "Det oppstod et problem under tilknytningen av stasjoner til blokker" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"En feil oppstod: {ex.Message}" });
            }
        }
    }
}