using System;

namespace DTOs.EnvResult_Dto
{
    public class EnvResultDto
    {
        public int EnvResultId { get; set; }
        public int SampleId { get; set; }
        public string AnalysisCategory { get; set; }
        public string AnalysisName { get; set; }
        public double AnalysisValue { get; set; }
        public string Units { get; set; }
        public string Remarks { get; set; }
    }
}
