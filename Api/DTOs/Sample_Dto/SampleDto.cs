using System;

namespace DTOs.Sample_Dto {

    public class SampleDto
    {
        public int SampleId { get; set; }
        public int StationId {get; set; }
        public string SampleCode { get; set; }
        public string SampleType { get; set; }
        public string MatrixType { get; set; }
        public string HabitatType { get; set; }
        public string SamplingDevice { get; set; }
        public double DepthLower { get; set; }
        public double DepthUpper { get; set; }
        public string SampleDescription { get; set; }
        public string Analysis { get; set; } 
        public Double Result { get; set; }  
        public string Unit {get; set; }     
    }
}
