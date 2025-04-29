using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Contractors
{
    public class ContractorAreaBlock
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BlockId { get; set; }

        // Utenlandsk nøkkel: Hvilket område tilhører denne blokken
        public int AreaId { get; set; }
        [ForeignKey("AreaId")]
        public ContractorArea? ContractorArea { get; set; }

        [Required]
        [StringLength(255)]
        public string BlockName { get; set; } = string.Empty;

        public string BlockDescription { get; set; } = string.Empty;

        [StringLength(100)]
        public string Status { get; set; } = string.Empty;
        
        // Eksisterende GeoJSON-relaterte felt
        public string GeoJsonBoundary { get; set; } = string.Empty;
        public double CenterLatitude { get; set; }
        public double CenterLongitude { get; set; }
        public double AreaSizeKm2 { get; set; }
        
        // Nye analytiske felt - make Category nullable by adding ?
        public string? Category { get; set; }
        public double ResourceDensity { get; set; }
        public double EconomicValue { get; set; }
    }
}