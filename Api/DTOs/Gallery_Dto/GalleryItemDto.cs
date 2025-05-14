using System;

namespace DTOs.Gallery_Dto
{
    // DTO for media items in the gallery
    public class GalleryItemDto
    {
        // Unique ID of the media
        public int MediaId { get; set; }

        // Name of the file in storage
        public string? FileName { get; set; }

        // Type of media (e.g., image, video)
        public string? MediaType { get; set; }

        // URL where media is stored
        public string? MediaUrl { get; set; }

        // Date when media was captured
        public DateTime CaptureDate { get; set; }

        // Details about the camera used
        public string? CameraSpecs { get; set; }

        // Any extra remarks about the media
        public string? Remarks { get; set; }
        
        // ID of the related sample
        public int SampleId { get; set; }

        // Code for the sample
        public string? SampleCode { get; set; }

        // Type of the sample
        public string? SampleType { get; set; }

        // ID of the station where sample was taken
        public int StationId { get; set; }

        // Code for the station
        public string? StationCode { get; set; }

        // Latitude of the station location
        public double Latitude { get; set; }

        // Longitude of the station location
        public double Longitude { get; set; }

        // ID of the cruise this station belongs to
        public int CruiseId { get; set; }

        // Name of the cruise
        public string? CruiseName { get; set; }

        // ID of the contractor for this cruise
        public int ContractorId { get; set; }

        // Name of the contractor
        public string? ContractorName { get; set; }
        
        // Frontend uses this URL to show the file
        public string? FileUrl { get; set; }

        // URL for the thumbnail image
        public string? ThumbnailUrl { get; set; }

        // Description text for the media
        public string? Description { get; set; }
    }
}
