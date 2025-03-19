using DTOs.Library_Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Api.Services.Interfaces;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LibraryController : ControllerBase
    {
        private readonly ILibraryService _libraryService;

        public LibraryController(ILibraryService libraryService)
        {
            _libraryService = libraryService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] LibraryDto dto)
        {
            try
            {
                var fileUrl = await _libraryService.UploadFileAsync(file, dto);
                return Ok(new { message = "Upload successful", fileUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("list")]
        public async Task<IActionResult> List()
        {
            var list = await _libraryService.GetAllAsync();

            // Append Azure URL for each file
            foreach (var item in list)
            {
                item.FileName = $"https://isalibraryfiles.blob.core.windows.net/files/{item.FileName}";
                
            }

            return Ok(list);
        }

        [HttpGet("contractors")]
        public IActionResult GetContractors()
        {
            var contractorNames = _libraryService.GetDistinctContractors();
            return Ok(contractorNames);
        }

        [HttpGet("themes")]
        public IActionResult GetThemes()
        {
            var themes = _libraryService.GetDistinctThemes();
            return Ok(themes);
        }
    }
}
