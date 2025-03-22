using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Models.Contractors;
using Models.Cruises;
using Models.Stations;
using Models.Samples;
using Models.Photo_Video;
using DTOs.Contractors_Dto;
using DTOs.Cruise_Dto;
using DTOs.Station_Dto;
using DTOs.Sample_Dto;
using DTOs.PhotoVideo_Dto;
using System.Linq;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MapFilterController : ControllerBase
    {
        private readonly MyDbContext _context;

        public MapFilterController(MyDbContext context)
        {
            _context = context;
        }

        // Get all contractors with their areas
        [HttpGet("contractors")]
        public async Task<ActionResult<IEnumerable<ContractorDto>>> GetContractors()
        {
            var contractors = await _context.Contractors
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

            return contractors;
        }

        // Get all contractor areas
        [HttpGet("contractor-areas")]
        public async Task<ActionResult<IEnumerable<ContractorAreaDto>>> GetContractorAreas(
            [FromQuery] int? contractorId)
        {
            var query = _context.ContractorAreas.AsQueryable();
            
            if (contractorId.HasValue)
            {
                query = query.Where(a => a.ContractorId == contractorId.Value);
            }

            var areas = await query
                .Select(a => new ContractorAreaDto
                {
                    AreaId = a.AreaId,
                    ContractorId = a.ContractorId,
                    AreaName = a.AreaName,
                    AreaDescription = a.AreaDescription
                })
                .ToListAsync();

            return areas;
        }

        // Get area blocks with the option to filter by area
        [HttpGet("contractor-area-blocks")]
        public async Task<ActionResult<IEnumerable<ContractorAreaBlockDto>>> GetContractorAreaBlocks(
            [FromQuery] int? areaId)
        {
            var query = _context.ContractorAreaBlocks.AsQueryable();
            
            if (areaId.HasValue)
            {
                query = query.Where(b => b.AreaId == areaId.Value);
            }

            var blocks = await query
                .Select(b => new ContractorAreaBlockDto
                {
                    BlockId = b.BlockId,
                    AreaId = b.AreaId,
                    BlockName = b.BlockName,
                    BlockDescription = b.BlockDescription,
                    Status = b.Status
                })
                .ToListAsync();

            return blocks;
        }

        // Get cruises with option to filter by contractor
        [HttpGet("cruises")]
        public async Task<ActionResult<IEnumerable<CruiseDto>>> GetCruises(
            [FromQuery] int? contractorId)
        {
            var query = _context.Cruises.AsQueryable();
            
            if (contractorId.HasValue)
            {
                query = query.Where(c => c.ContractorId == contractorId.Value);
            }

            var cruises = await query
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

            return cruises;
        }

        // Get stations with option to filter by cruise and/or location
        [HttpGet("stations")]
        public async Task<ActionResult<IEnumerable<StationDto>>> GetStations(
            [FromQuery] int? cruiseId,
            [FromQuery] double? minLat,
            [FromQuery] double? maxLat,
            [FromQuery] double? minLon,
            [FromQuery] double? maxLon)
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

            var stations = await query
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

            return stations;
        }

        // Get samples with option to filter by station
        [HttpGet("samples")]
        public async Task<ActionResult<IEnumerable<SampleDto>>> GetSamples(
            [FromQuery] int? stationId,
            [FromQuery] string sampleType)
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

            var samples = await query
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

            return samples;
        }

        // Get photos/videos with option to filter by sample
        [HttpGet("media")]
        public async Task<ActionResult<IEnumerable<PhotoVideoDto>>> GetMedia(
            [FromQuery] int? sampleId,
            [FromQuery] string mediaType)
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

            var media = await query
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

            return media;
        }

       // In the GetMapData method of MapFilterController.cs

[HttpGet("map-data")]
public async Task<ActionResult<object>> GetMapData(
    [FromQuery] int? contractorId,
    [FromQuery] int? contractTypeId, 
    [FromQuery] int? contractStatusId,
    [FromQuery] string? sponsoringState,
    [FromQuery] int? year,
    [FromQuery] int? cruiseId)
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

    // MODIFIED CRUISE QUERY LOGIC - this is the key change:
    var cruisesQuery = _context.Cruises.AsQueryable();
    
    // If a specific cruise ID is requested
    if (cruiseId.HasValue)
    {
        cruisesQuery = cruisesQuery.Where(c => c.CruiseId == cruiseId.Value);
    }
    // If a specific contractor ID is requested, get ALL cruises for that contractor
    else if (contractorId.HasValue)
    {
        cruisesQuery = cruisesQuery.Where(c => c.ContractorId == contractorId.Value);
    }
    // Otherwise, get cruises for all filtered contractors
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
            c.Remarks,
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
            c.ContractorId, // Make sure to include ContractorId for relationship
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
        // Get contract types for filtering
        [HttpGet("contract-types")]
        public async Task<ActionResult<IEnumerable<ContractTypeDto>>> GetContractTypes()
        {
            var types = await _context.ContractTypes
                .Select(t => new ContractTypeDto
                {
                    ContractTypeId = t.ContractTypeId,
                    ContractTypeName = t.ContractTypeName
                })
                .ToListAsync();

            return types;
        }

        // Get contract statuses for filtering
        [HttpGet("contract-statuses")]
        public async Task<ActionResult<IEnumerable<ContractStatusDto>>> GetContractStatuses()
        {
            var statuses = await _context.ContractStatuses
                .Select(s => new ContractStatusDto
                {
                    ContractStatusId = s.ContractStatusId,
                    ContractStatusName = s.ContractStatusName
                })
                .ToListAsync();

            return statuses;
        }

        // Get unique sponsoring states
        [HttpGet("sponsoring-states")]
        public async Task<ActionResult<IEnumerable<string>>> GetSponsoringStates()
        {
            var states = await _context.Contractors
                .Select(c => c.SponsoringState)
                .Distinct()
                .ToListAsync();

            return states;
        }

        // Get unique contractual years
        [HttpGet("contractual-years")]
        public async Task<ActionResult<IEnumerable<int>>> GetContractualYears()
        {
            var years = await _context.Contractors
                .Select(c => c.ContractualYear)
                .Distinct()
                .OrderByDescending(y => y)
                .ToListAsync();

            return years;
        }


        // I Api/Controller/MapFilterController.cs
[HttpGet("area-geojson/{areaId}")]
public async Task<ActionResult<object>> GetAreaGeoJson(int areaId)
{
    var area = await _context.ContractorAreas
        .Include(a => a.ContractorAreaBlocks)
        .FirstOrDefaultAsync(a => a.AreaId == areaId);
        
    if (area == null)
        return NotFound();
        
    return new {
        areaId = area.AreaId,
        areaName = area.AreaName,
        geoJson = area.GeoJsonBoundary,
        blocks = area.ContractorAreaBlocks.Select(b => new {
            blockId = b.BlockId,
            blockName = b.BlockName,
            status = b.Status,
            geoJson = b.GeoJsonBoundary,
            centerLat = b.CenterLatitude,
            centerLon = b.CenterLongitude,
            areaSizeKm2 = b.AreaSizeKm2
        }).ToList()
    };
}

[HttpGet("contractor-areas-geojson/{contractorId}")]
public async Task<ActionResult<object>> GetContractorAreasGeoJson(int contractorId)
{
    var areas = await _context.ContractorAreas
        .Include(a => a.ContractorAreaBlocks)
        .Where(a => a.ContractorId == contractorId)
        .ToListAsync();
        
    if (!areas.Any())
        return NotFound();
        
    return areas.Select(area => new {
        areaId = area.AreaId,
        areaName = area.AreaName,
        geoJson = area.GeoJsonBoundary,
        centerLat = area.CenterLatitude,
        centerLon = area.CenterLongitude,
        totalAreaSizeKm2 = area.TotalAreaSizeKm2,
        allocationDate = area.AllocationDate,
        expiryDate = area.ExpiryDate,
        blocks = area.ContractorAreaBlocks.Select(b => new {
            blockId = b.BlockId,
            blockName = b.BlockName,
            status = b.Status,
            geoJson = b.GeoJsonBoundary,
            centerLat = b.CenterLatitude,
            centerLon = b.CenterLongitude,
            areaSizeKm2 = b.AreaSizeKm2
        }).ToList()
    }).ToList();
}




    }
}