using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Contractors
{
    // Entity model for an area assigned to a contractor
    public class ContractorArea
    {
        // Primary key: unique ID for the area
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AreaId { get; set; }

        // Foreign key: ID of the contractor who owns this area
        public int ContractorId { get; set; }
        [ForeignKey("ContractorId")]
        public Contractor Contractor { get; set; }

        // Name of the area
        [Required]
        [StringLength(255)]
        public string AreaName { get; set; }

        // Description or notes about the area
        public string AreaDescription { get; set; }
        
        // GeoJSON string defining the boundary of the area
        public string GeoJsonBoundary { get; set; }

        // Latitude of the area's center point
        public double CenterLatitude { get; set; }

        // Longitude of the area's center point
        public double CenterLongitude { get; set; }

        // Total size of the area in square kilometers
        public double TotalAreaSizeKm2 { get; set; }

        // Date when the area was allocated to the contractor
        public DateTime AllocationDate { get; set; }

        // Date when the allocation expires
        public DateTime ExpiryDate { get; set; }

        // Navigation property: blocks linked to this area
        public ICollection<ContractorAreaBlock> ContractorAreaBlocks { get; set; }
    }
}
