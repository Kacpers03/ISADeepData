using Microsoft.AspNetCore.Mvc;
using Api.Services.Interfaces;
using DTOs.Sample_Dto;
using Models.Samples;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/Sample")]
    public class SampleController : ControllerBase
    {
        private readonly ISampleService _sampleService;
        private readonly MyDbContext _context;

        public SampleController(ISampleService sampleService, MyDbContext context)
        {
            _sampleService = sampleService;
            _context = context;
        }

        // Get all samples with related Station, Cruise, and Contractor data
        [HttpGet("list")]
        public async Task<IActionResult> GetAllSamples()
        {
            var samples = await _context.Samples
                .Include(s => s.Station)
                    .ThenInclude(st => st.Cruise)
                        .ThenInclude(cr => cr.Contractor)
                .Select(s => new SampleDto
                {
                    SampleId = s.SampleId,
                    StationId = s.StationId , // Handle possible null StationId
                    SampleCode = s.SampleCode ?? "",
                    SampleType = s.SampleType ?? "",
                    MatrixType = s.MatrixType ?? "",
                    HabitatType = s.HabitatType ?? "",
                    SamplingDevice = s.SamplingDevice ?? "",
                    DepthLower = s.DepthLower,
                    DepthUpper = s.DepthUpper,
                    SampleDescription = s.SampleDescription ?? "",
                    Analysis = s.Analysis ?? "",
                    Result = s.Result,
                    Unit = s.Unit ?? "",

                    // Get related values safely (in case they are null)
                    StationCode = s.Station != null ? s.Station.StationCode ?? "" : "",
                    CruiseName = s.Station != null && s.Station.Cruise != null ? s.Station.Cruise.CruiseName ?? "" : "",
                    ContractorName = s.Station != null && s.Station.Cruise != null && s.Station.Cruise.Contractor != null 
                        ? s.Station.Cruise.Contractor.ContractorName ?? "" 
                        : ""
                })
                .ToListAsync();

            return Ok(new { result = samples });
        }

        // Get distinct Sample Types
        [HttpGet("sampletypes")]
        public async Task<IActionResult> GetSampleTypes()
        {
            var types = await _sampleService.GetDistinctSampleTypesAsync();
            return Ok(new { result = types });
        }

        // Get distinct Matrix Types
        [HttpGet("matrixtypes")]
        public async Task<IActionResult> GetMatrixTypes()
        {
            var types = await _sampleService.GetDistinctMatrixTypesAsync();
            return Ok(new { result = types });
        }

        // Get distinct Habitat Types
        [HttpGet("habitattypes")]
        public async Task<IActionResult> GetHabitatTypes()
        {
            var types = await _sampleService.GetDistinctHabitatTypesAsync();
            return Ok(new { result = types });
        }

        // Get distinct Analyses
        [HttpGet("analyses")]
        public async Task<IActionResult> GetAnalyses()
        {
            var types = await _sampleService.GetDistinctAnalysesAsync();
            return Ok(new { result = types });
        }

        // Get distinct Station Codes
        [HttpGet("stations")]
        public async Task<IActionResult> GetStations()
        {
            var stations = await _sampleService.GetDistinctStationCodesAsync();
            return Ok(new { result = stations });
        }

        // Get distinct Cruise Names
        [HttpGet("cruises")]
        public async Task<IActionResult> GetCruises()
        {
            var cruises = await _sampleService.GetDistinctCruiseNamesAsync();
            return Ok(new { result = cruises });
        }

        // Get distinct Contractor Names
        [HttpGet("contractors")]
        public async Task<IActionResult> GetContractors()
        {
            var contractors = await _sampleService.GetDistinctContractorNamesAsync();
            return Ok(new { result = contractors });
        }
    }
}
