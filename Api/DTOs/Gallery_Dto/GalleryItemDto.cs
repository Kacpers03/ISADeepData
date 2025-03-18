using System;

namespace DTOs.Gallery_Dto
{
    public class GalleryItemDto
    {
        // Original properties
        public int MediaId { get; set; }
        public string FileName { get; set; }
        public string MediaType { get; set; }
        public string MediaUrl { get; set; }
        public DateTime CaptureDate { get; set; }
        public string CameraSpecs { get; set; }
        public string Remarks { get; set; }
        
        // Navigation metadata
        public int SampleId { get; set; }
        public string SampleCode { get; set; }
        public string SampleType { get; set; }
        public int StationId { get; set; }
        public string StationCode { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int CruiseId { get; set; }
        public string CruiseName { get; set; }
        public int ContractorId { get; set; }
        public string ContractorName { get; set; }
        
        // Properties specifically needed by frontend
        public string FileUrl { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Description { get; set; }
    }
}