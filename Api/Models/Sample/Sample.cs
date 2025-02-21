using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Stations;
using Models.Env_Result;
using Models.Geo_result;
using Models.Photo_Video;

namespace Models.Samples
{
    public class Sample
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SampleId { get; set; } // sample_id

        // Utenlandsk nøkkel: Hvilken Station tilhører denne prøven?
        public int StationId { get; set; }
        [ForeignKey("StationId")]
        public Station Station { get; set; }

        [StringLength(100)]
        public string SampleCode { get; set; } // sample_code

        [StringLength(100)]
        public string SampleType { get; set; } // sample_type

        [StringLength(100)]
        public string MatrixType { get; set; } // matrix_type

        [StringLength(100)]
        public string HabitatType { get; set; } // habitat_type

        [StringLength(255)]
        public string SamplingDevice { get; set; } // sampling_device

        public double DepthLower { get; set; } // depth_lower
        public double DepthUpper { get; set; } // depth_upper

        public string SampleDescription { get; set; } // sample_description

        // Navigasjon: resultater, bilder/video
        public ICollection<EnvResult> EnvResults { get; set; }
        public ICollection<GeoResult> GeoResults { get; set; }
        public ICollection<PhotoVideo> PhotoVideos { get; set; }
    }
}
