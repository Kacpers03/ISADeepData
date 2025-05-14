using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Api.Services.Interfaces;
using DTOs.Gallery_Dto;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private readonly IGalleryService _galleryService;
        
        // Constructor: set up the gallery service
        public GalleryController(IGalleryService galleryService)
        {
            _galleryService = galleryService;
        }
        
        // GET api/gallery/media
        // Get a list of media items, with optional filters
        [HttpGet("media")]
        public async Task<ActionResult<IEnumerable<GalleryItemDto>>> GetGalleryMedia(
            [FromQuery] string? mediaType,
            [FromQuery] int? contractorId,
            [FromQuery] int? areaId,
            [FromQuery] int? blockId,
            [FromQuery] int? cruiseId,
            [FromQuery] int? stationId,
            [FromQuery] int? sampleId,
            [FromQuery] int? year)
        {
            try
            {
                // Get filtered items from service
                var items = await _galleryService.GetGalleryItemsAsync(
                    contractorId, areaId, blockId, cruiseId, stationId, sampleId, 
                    mediaType, year);
                
                // For each item, set URLs and descriptions
                foreach (var item in items)
                {
                    // Choose a sample file name based on MediaId
                    int fileIndex = (item.MediaId % 8) + 1; // 1 to 8
                    string mappedFileName = $"organism{fileIndex}.jpg";
                    
                    // Build full URL to storage
                    item.MediaUrl = $"https://isagallerystorage.blob.core.windows.net/gallery/{mappedFileName}";
                    
                    // Frontend expects FileUrl and ThumbnailUrl
                    item.FileUrl = item.MediaUrl;
                    item.ThumbnailUrl = item.MediaUrl;
                    
                    // Use remarks or default description
                    item.Description = item.Remarks ?? $"Image {item.MediaId}";
                    
                    // Keep original filename for logs
                    string originalFileName = item.FileName ?? string.Empty;
                    Console.WriteLine($"Mapped {originalFileName} to {mappedFileName}");
                }
                
                // Return the list of items
                return Ok(items);
            }
            catch (Exception ex)
            {
                // If something goes wrong, return 500 with error message
                return StatusCode(500, new { message = $"Error retrieving gallery items: {ex.Message}" });
            }
        }
        
        // GET api/gallery/{mediaId}/download
        // Download a specific media file by ID
        [HttpGet("{mediaId}/download")]
        public async Task<IActionResult> DownloadMedia(int mediaId)
        {
            try
            {
                // Get file bytes, MIME type, and name from service
                var (content, contentType, fileName) = await _galleryService.GetMediaForDownloadAsync(mediaId);
                // Return file to client
                return File(content, contentType, fileName);
            }
            catch (FileNotFoundException)
            {
                // If file not found, return 404
                return NotFound(new { message = "Media file not found" });
            }
            catch (ArgumentException ex)
            {
                // If bad input, return 400 with message
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Other errors return 500
                return StatusCode(500, new { message = $"Error downloading media: {ex.Message}" });
            }
        }
    }
}
