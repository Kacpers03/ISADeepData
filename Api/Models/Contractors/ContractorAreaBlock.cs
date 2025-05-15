using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Contractors
{
    // Entity model for a block within a contractor's area
    public class ContractorAreaBlock
    {
        // Primary key: unique ID for this block
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BlockId { get; set; }

        // Foreign key: ID of the area this block belongs to
        public int AreaId { get; set; }
        [ForeignKey("AreaId")]
        public ContractorArea? ContractorArea { get; set; }

        // Name of the block
        [Required]
        [StringLength(255)]
        public string BlockName { get; set; } = string.Empty;

        // Description or notes about the block
        public string BlockDescription { get; set; } = string.Empty;

        // Status of the block (e.g., active, inactive)
        [StringLength(100)]
        public string Status { get; set; } = string.Empty;
        
        // GeoJSON boundary for the block's shape
        public string GeoJsonBoundary { get; set; } = string.Empty;

        // Center point latitude of the block
        public double CenterLatitude { get; set; }

        // Center point longitude of the block
        public double CenterLongitude { get; set; }

        // Size of the block in square kilometers
        public double AreaSizeKm2 { get; set; }
        
        // Category classification for analysis (nullable)
        public string? Category { get; set; }

        // Resource density metric for the block
        public double ResourceDensity { get; set; }

        // Economic value metric for the block
        public double EconomicValue { get; set; }
    }
}