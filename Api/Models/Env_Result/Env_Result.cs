using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Samples;

namespace Models.Env_Result
{
    // Entity model for environmental analysis results
    public class EnvResult
    {
        // Primary key: unique ID for this result record
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EnvResultId { get; set; }

        // Foreign key: ID of the sample linked to this result
        public int SampleId { get; set; }
        [ForeignKey("SampleId")]
        public Sample? Sample { get; set; }

        // Category of the analysis (e.g., chemical, biological)
        [StringLength(100)]
        public string AnalysisCategory { get; set; } = string.Empty;

        // Name of the analysis method used
        [StringLength(100)]
        public string AnalysisName { get; set; } = string.Empty;

        // Measured value from the analysis
        public double AnalysisValue { get; set; }

        // Units for the analysis value (e.g., mg/L)
        [StringLength(50)]
        public string Units { get; set; } = string.Empty;

        // Any extra notes about the result
        public string Remarks { get; set; } = string.Empty;
    }
}
