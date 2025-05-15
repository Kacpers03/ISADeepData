using System;

namespace DTOs.Sample_Dto
{
    // DTO for sample information including related metadata
    public class SampleDto
    {
        // Unique ID of the sample
        public int SampleId { get; set; }

        // ID of the station where sample was taken
        public int StationId { get; set; }

        // Code or label for the sample
        public string? SampleCode { get; set; }

        // Type of sample 
        public string? SampleType { get; set; }

        // Matrix type of the sample 
        public string? MatrixType { get; set; }

        // Habitat type where sample was collected
        public string? HabitatType { get; set; }

        // Device used for sampling
        public string? SamplingDevice { get; set; }

        // Lower depth of the sample in meters
        public double DepthLower { get; set; }

        // Upper depth of the sample in meters
        public double DepthUpper { get; set; }

        // Description or notes about the sample
        public string? SampleDescription { get; set; }

        // Analysis performed on the sample
        public string? Analysis { get; set; }

        // Result value from the analysis
        public double Result { get; set; }

        // Unit for the result value 
        public string? Unit { get; set; }

        // Related data for frontend display
        // Code for the station
        public string? StationCode { get; set; }

        // Name of the cruise
        public string? CruiseName { get; set; }

        // Name of the contractor
        public string? ContractorName { get; set; }
    }
}
