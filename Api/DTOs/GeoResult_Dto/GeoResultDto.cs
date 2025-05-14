using System;

namespace DTOs.GeoResult_Dto
{
    // DTO for geographic analysis results
    public class GeoResultDto
    {
        // Unique ID of this geo result record
        public int GeoResultId { get; set; }

        // ID of the sample this result belongs to
        public int SampleId { get; set; }

        // Category of the geographic analysis
        public string? Category { get; set; }

        // Name of the analysis performed
        public string? Analysis { get; set; }

        // Numeric result value of the analysis
        public double Value { get; set; }

        // Units for the result value 
        public string? Units { get; set; }

        // Qualifier for the result 
        public string? Qualifier { get; set; }

        // Any extra notes or remarks for this result
        public string? Remarks { get; set; }
    }
}
