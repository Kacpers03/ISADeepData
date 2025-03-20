using Microsoft.AspNetCore.Mvc;
using Api.Services.Interfaces;
using DTOs.Sample_Dto;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SampleController : ControllerBase
    {
        private readonly ISampleService _sampleService;

        public SampleController(ISampleService sampleService)
        {
            _sampleService = sampleService;
        }

        // GET: api/sample/list
        [HttpGet("list")]
        public async Task<IActionResult> GetAllSamples()
        {
            var samples = await _sampleService.GetAllSamplesAsync();
            return Ok(samples);
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
    }
}
