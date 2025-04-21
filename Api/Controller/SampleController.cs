using Microsoft.AspNetCore.Mvc;
using Api.Services.Interfaces;
using DTOs.Sample_Dto;
using Api.Repositories.Interfaces;
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

        // GET: api/sample/list
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
                    StationId = s.StationId,
                    SampleCode = s.SampleCode,
                    SampleType = s.SampleType,
                    MatrixType = s.MatrixType,
                    HabitatType = s.HabitatType,
                    SamplingDevice = s.SamplingDevice,
                    DepthLower = s.DepthLower,
                    DepthUpper = s.DepthUpper,
                    SampleDescription = s.SampleDescription,
                    Analysis = s.Analysis,
                    Result = s.Result,
                    Unit = s.Unit,

                    // Flattened navigation values
                    StationCode = s.Station.StationCode,
                    CruiseName = s.Station.Cruise.CruiseName,
                    ContractorName = s.Station.Cruise.Contractor.ContractorName
                })
                .ToListAsync();

            return Ok(new { result = samples });
        }




        // Optional: For filter dropdowns
        [HttpGet("sampletypes")]
        public async Task<IActionResult> GetSampleTypes()
        {
            var types = await _sampleService.GetDistinctSampleTypesAsync();
            return Ok(new { result = types });
        }

        [HttpGet("matrixtypes")]
        public async Task<IActionResult> GetMatrixTypes()
        {
            var types = await _sampleService.GetDistinctMatrixTypesAsync();
            return Ok(new { result = types });
        }

        [HttpGet("habitattypes")]
        public async Task<IActionResult> GetHabitatTypes()
        {
            var types = await _sampleService.GetDistinctHabitatTypesAsync();
            return Ok(new { result = types });
        }

        [HttpGet("analyses")]
        public async Task<IActionResult> GetAnalyses()
        {
            var types = await _sampleService.GetDistinctAnalysesAsync();
            return Ok(new { result = types });
        }

        [HttpGet("stations")]
        public async Task<IActionResult> GetStations()
        {
            var stations = await _sampleService.GetDistinctStationCodesAsync();
            return Ok(new { result = stations });
        }

        [HttpGet("cruises")]
        public async Task<IActionResult> GetCruises()
        {
            var cruises = await _sampleService.GetDistinctCruiseNamesAsync();
            return Ok(new { result = cruises });
        }

        [HttpGet("contractors")]
        public async Task<IActionResult> GetContractors()
        {
            var contractors = await _sampleService.GetDistinctContractorNamesAsync();
            return Ok(new { result = contractors });
        }

    }
}
