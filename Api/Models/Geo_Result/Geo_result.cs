using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Samples;

namespace Models.Geo_result
{
    // Entity model for geographic analysis results
    public class GeoResult
    {
        // Primary key: unique ID for this geo result record
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int GeoResultId { get; set; }

        // Foreign key: ID of the related sample
        public int SampleId { get; set; }
        [ForeignKey("SampleId")]
        public Sample? Sample { get; set; }

        // Category of the analysis result (e.g., depth, temperature)
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;

        // Name of the geographic analysis performed
        [StringLength(100)]
        public string Analysis { get; set; } = string.Empty;

        // Numeric value from the analysis
        public double Value { get; set; }

        // Units for the analysis value (e.g., meters, PSU)
        [StringLength(50)]
        public string Units { get; set; } = string.Empty;

        // Qualifier for the result (e.g., >, <, approx)
        [StringLength(100)]
        public string Qualifier { get; set; } = string.Empty;

        // Any extra notes or remarks about this result
        public string Remarks { get; set; } = string.Empty;
    }
}
