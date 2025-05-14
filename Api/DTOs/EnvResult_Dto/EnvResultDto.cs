using System;

namespace DTOs.EnvResult_Dto
{
    // DTO for environmental analysis results
    public class EnvResultDto
    {
        // Unique ID of the environmental result record
        public int EnvResultId { get; set; }

        // ID of the sample this result belongs to
        public int SampleId { get; set; }

        // Category of the analysis (e.g., chemical, biological)
        public string? AnalysisCategory { get; set; }

        // Specific name of the analysis performed
        public string? AnalysisName { get; set; }

        // Value obtained from the analysis
        public double AnalysisValue { get; set; }

        // Units for the analysis value (e.g., mg/L)
        public string? Units { get; set; }

        // Any extra notes or remarks about the result
        public string? Remarks { get; set; }
    }
}
