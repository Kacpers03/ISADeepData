using System;

namespace DTOs.PhotoVideo_Dto
{
    public class PhotoVideoDto
    {
        public int MediaId { get; set; }
        public int SampleId { get; set; }
        public string FileName { get; set; }
        public string MediaType { get; set; }
        public string CameraSpecs { get; set; }
        public DateTime CaptureDate { get; set; }
        public string Remarks { get; set; }
    }
}
