using System;

namespace DTOs.PhotoVideo_Dto
{
    // DTO for photo or video media items
    public class PhotoVideoDto
    {
        // Unique ID of the media
        public int MediaId { get; set; }

        // ID of the related sample
        public int SampleId { get; set; }

        // Original file name of the media
        public string? FileName { get; set; }

        // Type of media (e.g., photo, video)
        public string? MediaType { get; set; }

        // Details about the camera used
        public string? CameraSpecs { get; set; }

        // Date when media was captured
        public DateTime CaptureDate { get; set; }

        // Any extra remarks or notes about the media
        public string? Remarks { get; set; }
    }
}
