using System;

namespace DTOs.Contractors_Dto
{
    // DTO for returning block and area info with contractor details
    public class ContractorAreaBlockDto
    {
        // Unique ID of the block
        public int BlockId { get; set; }

        // ID of the area this block belongs to
        public int AreaId { get; set; }

        // Name of the area
        public string? AreaName { get; set; }

        // ID of the contractor responsible
        public int ContractorId { get; set; }

        // Name of the contractor
        public string? ContractorName { get; set; }

        // Name of the block
        public string? BlockName { get; set; }

        // Description of the block
        public string? BlockDescription { get; set; }

        // Status of the block (e.g., active, inactive)
        public string? Status { get; set; }

        // Latitude of the block center point
        public double CenterLatitude { get; set; }

        // Longitude of the block center point
        public double CenterLongitude { get; set; }

        // Size of the area in square kilometers
        public double AreaSizeKm2 { get; set; }

        // Category of the block or area
        public string? Category { get; set; } 
    }
}
