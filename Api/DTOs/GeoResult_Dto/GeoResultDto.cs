using System;

namespace DTOs.GeoResult_Dto
{
    public class GeoResultDto
    {
        public int GeoResultId { get; set; }
        public int SampleId { get; set; }
        public string Category { get; set; }
        public string Analysis { get; set; }
        public double Value { get; set; }
        public string Units { get; set; }
        public string Qualifier { get; set; }
        public string Remarks { get; set; }
    }
}
