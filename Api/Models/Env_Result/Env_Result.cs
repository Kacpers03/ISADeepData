using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Samples;

namespace Models.Env_Result
{
    public class EnvResult
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EnvResultId { get; set; } // env_result_id

        // Utenlandsk nøkkel: Hvilken Sample tilhører dette resultatet?
        public int SampleId { get; set; }
        [ForeignKey("SampleId")]
        public Sample Sample { get; set; }

        [StringLength(100)]
        public string AnalysisCategory { get; set; } // analysis_category

        [StringLength(100)]
        public string AnalysisName { get; set; } // analysis_name

        public double AnalysisValue { get; set; } // analysis_value

        [StringLength(50)]
        public string Units { get; set; } // units

        public string Remarks { get; set; } // remarks
    }
}
