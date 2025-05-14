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

        // Constructor: set up the library service
        public LibraryController(ILibraryService libraryService)
        {
            _libraryService = libraryService;
        }

        // POST api/library/upload
        // Upload a file with extra data in the form
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] LibraryDto dto)
        {
            try
            {
                // Call service to upload file and get its URL
                var fileUrl = await _libraryService.UploadFileAsync(file, dto);
                // Return success and URL
                return Ok(new { message = "Upload successful", fileUrl });
            }
            catch (Exception ex)
            {
                // If error, return 400 with message
                return BadRequest(ex.Message);
            }
        }

        // GET api/library/list
        // Get list of all library files
        [HttpGet("list")]
        public async Task<IActionResult> List()
        {
            // Get data from service
            var list = await _libraryService.GetAllAsync();

            // Add full Azure URL to each file name
            foreach (var item in list)
            {
                item.FileName = $"https://isalibraryfiles.blob.core.windows.net/files/{item.FileName}";
            }

            // Return the list
            return Ok(list);
        }

        // GET api/library/contractors
        // Get unique contractor names from library
        [HttpGet("contractors")]
        public IActionResult GetContractors()
        {
            // Get list of names
            var contractorNames = _libraryService.GetDistinctContractors();
            return Ok(contractorNames);
        }

        // GET api/library/themes
        // Get unique themes from library items
        [HttpGet("themes")]
        public IActionResult GetThemes()
        {
            // Get list of themes
            var themes = _libraryService.GetDistinctThemes();
            return Ok(themes);
        }
    }
}
