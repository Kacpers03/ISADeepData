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
        public int SampleId { get; set; }

        public int StationId { get; set; } // Nullable
        [ForeignKey("StationId")]
        public Station Station { get; set; }

        [StringLength(100)]
        public string SampleCode { get; set; }

        [StringLength(100)]
        public string SampleType { get; set; }

        [StringLength(100)]
        public string MatrixType { get; set; }

        [StringLength(100)]
        public string HabitatType { get; set; }

        [StringLength(255)]
        public string SamplingDevice { get; set; }

        public double DepthLower { get; set; }
        public double DepthUpper { get; set; }

        public string SampleDescription { get; set; }

        [StringLength(100)]
        public string Analysis { get; set; }

        public Double Result { get; set; }
        public string Unit {get; set;}

        public ICollection<EnvResult>? EnvResults { get; set; }
        public ICollection<GeoResult>? GeoResults { get; set; }
        public ICollection<PhotoVideo>? PhotoVideos { get; set; }
    }
}