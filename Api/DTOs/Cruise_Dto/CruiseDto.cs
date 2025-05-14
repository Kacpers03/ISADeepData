using System;

namespace DTOs.Cruise_Dto
{
    // DTO for cruise information
    public class CruiseDto
    {
        // Unique ID of the cruise
        public int CruiseId { get; set; }

        // ID of the contractor who organized this cruise
        public int ContractorId { get; set; }

        // Name or identifier of the cruise
        public string? CruiseName { get; set; }

        // Name of the research vessel used
        public string? ResearchVessel { get; set; }

        // Date when the cruise started
        public DateTime StartDate { get; set; }

        // Date when the cruise ended
        public DateTime EndDate { get; set; }
    }
}