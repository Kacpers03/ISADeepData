using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Samples;

namespace Models.Geo_result
{
    public class GeoResult
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int GeoResultId { get; set; } // geo_result_id

        // Utenlandsk nøkkel: Hvilken Sample tilhører dette resultatet?
        public int SampleId { get; set; }
        [ForeignKey("SampleId")]
        public Sample Sample { get; set; }

        [StringLength(100)]
        public string Category { get; set; } // category

        [StringLength(100)]
        public string Analysis { get; set; } // analysis

        public double Value { get; set; } // value

        [StringLength(50)]
        public string Units { get; set; } // units

        [StringLength(100)]
        public string Qualifier { get; set; } // qualifier

        public string Remarks { get; set; } // remarks
    }
}
