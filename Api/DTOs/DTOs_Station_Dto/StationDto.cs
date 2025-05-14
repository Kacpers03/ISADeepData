using System;

namespace DTOs.Station_Dto
{
    // DTO for station information in a cruise
    public class StationDto
    {
        // Unique ID of the station
        public int StationId { get; set; }

        // ID of the cruise this station belongs to
        public int CruiseId { get; set; }

        // Code or short name for the station
        public string? StationCode { get; set; }

        // Type of station (e.g., sampling, reference)
        public string? StationType { get; set; }

        // Latitude coordinate of the station location
        public double Latitude { get; set; }

        // Longitude coordinate of the station location
        public double Longitude { get; set; }
    }
}
