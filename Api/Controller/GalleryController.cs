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
        
        public GalleryController(IGalleryService galleryService)
        {
            _galleryService = galleryService;
        }
        
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
                var items = await _galleryService.GetGalleryItemsAsync(
                    contractorId, areaId, blockId, cruiseId, stationId, sampleId, 
                    mediaType, year);
                
                // Add thumbnail and file URLs to each item
                foreach (var item in items)
                {
                    // Set the full URL for the media
                    item.MediaUrl = $"https://isalibraryfiles.blob.core.windows.net/files/{item.FileName}";
                    
                    // For the frontend, rename fields to match expected format
                    item.FileUrl = item.MediaUrl;
                    
                    // Create a thumbnail URL (using the same URL for now)
                    // In a production environment, you'd generate actual thumbnails
                    item.ThumbnailUrl = item.MediaUrl;
                    
                    // Add any additional properties needed by frontend
                    item.Description = item.Remarks;
                }
                
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error retrieving gallery items: {ex.Message}" });
            }
        }
        
        [HttpGet("{mediaId}/download")]
        public async Task<IActionResult> DownloadMedia(int mediaId)
        {
            try
            {
                var (content, contentType, fileName) = await _galleryService.GetMediaForDownloadAsync(mediaId);
                return File(content, contentType, fileName);
            }
            catch (FileNotFoundException)
            {
                return NotFound(new { message = "Media file not found" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error downloading media: {ex.Message}" });
            }
        }
    }
}