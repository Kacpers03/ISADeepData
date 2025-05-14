using System;

namespace DTOs.Contractors_Dto
{
    // DTO for returning area info with contractor details
    public class ContractorAreaDto
    {
        // Unique ID of the area
        public int AreaId { get; set; }

        // ID of the contractor responsible for this area
        public int ContractorId { get; set; }

        // Name of the area
        public string? AreaName { get; set; }

        // Description or notes about the area
        public string? AreaDescription { get; set; }

        // Latitude of the center point of the area
        public double CenterLatitude { get; set; }

        // Longitude of the center point of the area
        public double CenterLongitude { get; set; }

        // Total size of the area in square kilometers
        public double TotalAreaSizeKm2 { get; set; }

        // Date when the area was allocated
        public DateTime AllocationDate { get; set; }

        // Date when the area's allocation expires
        public DateTime ExpiryDate { get; set; }
    }
}
