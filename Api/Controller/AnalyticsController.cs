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

        // Constructor: setup database and services
        public AnalyticsController(
            MyDbContext context,
            ISpatialService spatialService,
            IMapFilterService mapFilterService)
        {
            _context = context;
            _spatialService = spatialService;
            _mapFilterService = mapFilterService;
        }

        // GET api/analytics/block/{blockId}
        // Get analysis for one block by its ID
        [HttpGet("block/{blockId}")]
        public async Task<ActionResult<object>> GetBlockAnalysis(int blockId)
        {
            // Ask service for block data
            var result = await _mapFilterService.GetBlockAnalysisAsync(blockId);

            // If no data, return 404
            if (result == null)
                return NotFound();

            // Return data
            return result;
        }

        // GET api/analytics/contractor/{contractorId}/summary
        // Get a summary for one contractor
        [HttpGet("contractor/{contractorId}/summary")]
        public async Task<ActionResult<object>> GetContractorSummary(int contractorId)
        {
            // Find contractor with type and status
            var contractor = await _context.Contractors
                .Include(c => c.ContractType)
                .Include(c => c.ContractStatus)
                .FirstOrDefaultAsync(c => c.ContractorId == contractorId);

            // If not found, return 404
            if (contractor == null)
                return NotFound();

            // Get contractor's areas
            var areas = await _context.ContractorAreas
                .Where(a => a.ContractorId == contractorId)
                .ToListAsync();
            var areaIds = areas.Select(a => a.AreaId).ToList();

            // Get blocks in those areas
            var blocks = await _context.ContractorAreaBlocks
                .Where(b => areaIds.Contains(b.AreaId))
                .ToListAsync();

            // Get cruises for contractor
            var cruises = await _context.Cruises
                .Where(c => c.ContractorId == contractorId)
                .ToListAsync();
            var cruiseIds = cruises.Select(c => c.CruiseId).ToList();

            // Get stations in those cruises
            var stations = await _context.Stations
                .Where(s => cruiseIds.Contains(s.CruiseId))
                .ToListAsync();
            var stationIds = stations.Select(s => s.StationId).ToList();

            // Get samples from those stations
            var samples = await _context.Samples
                .Where(s => stationIds.Contains(s.StationId))
                .ToListAsync();

            // Calculate stats
            var totalAreaKm2 = blocks.Sum(b => b.AreaSizeKm2);
            var earliestCruise = cruises.Any() ? cruises.Min(c => c.StartDate) : DateTime.MinValue;
            var latestCruise = cruises.Any() ? cruises.Max(c => c.EndDate) : DateTime.MinValue;

            // Return summary
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
                    // Years since contract year
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
                    // Count days for all cruises
                    ExpeditionDays = cruises.Sum(c => (c.EndDate - c.StartDate).Days + 1)
                },
                // List each area with block count
                Areas = areas.Select(a => new
                {
                    a.AreaId,
                    a.AreaName,
                    a.TotalAreaSizeKm2,
                    BlockCount = blocks.Count(b => b.AreaId == a.AreaId)
                }).ToList()
            };
        }

        // POST api/analytics/associate-stations-blocks
        // Link stations to blocks by location
        [HttpPost("associate-stations-blocks")]
        public async Task<ActionResult<object>> AssociateStationsWithBlocks()
        {
            try
            {
                // Run spatial service
                var result = await _spatialService.AssociateStationsWithBlocks();

                if (result)
                {
                    // Success
                    return Ok(new { message = "Stations are now linked to blocks" });
                }
                else
                {
                    // Service failed
                    return BadRequest(new { message = "Failed to link stations to blocks" });
                }
            }
            catch (Exception ex)
            {
                // Unexpected error
                return StatusCode(500, new { message = $"Error: {ex.Message}" });
            }
        }
    }
}
