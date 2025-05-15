using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Stations;
using Models.Env_Result;
using Models.Geo_result;
using Models.Photo_Video;

namespace Models.Samples
{
    // Entity model for a sample collected at a station
    public class Sample
    {
        // Primary key: unique ID for the sample
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SampleId { get; set; }

        // Foreign key: ID of the station where this sample was taken
        public int StationId { get; set; } // may be null if not linked
        [ForeignKey("StationId")]
        public Station Station { get; set; }

        // Code or label for the sample
        [StringLength(100)]
        public string SampleCode { get; set; }

        // Type of sample (e.g., water, sediment)
        [StringLength(100)]
        public string SampleType { get; set; }

        // Matrix type (e.g., water, soil)
        [StringLength(100)]
        public string MatrixType { get; set; }

        // Habitat where the sample was taken
        [StringLength(100)]
        public string HabitatType { get; set; }

        // Device used to collect the sample
        [StringLength(255)]
        public string SamplingDevice { get; set; }

        // Lower depth limit in meters for the sample
        public double DepthLower { get; set; }

        // Upper depth limit in meters for the sample
        public double DepthUpper { get; set; }

        // Description or notes about the sample
        public string SampleDescription { get; set; }

        // Analysis method or code used on the sample
        [StringLength(100)]
        public string Analysis { get; set; }

        // Result value from the analysis
        public double Result { get; set; }

        // Unit for the result value (e.g., mg/L)
        public string Unit { get; set; }

        // Related environmental results for this sample
        public ICollection<EnvResult>? EnvResults { get; set; }

        // Related geographic results for this sample
        public ICollection<GeoResult>? GeoResults { get; set; }

        // Related photos and videos for this sample
        public ICollection<PhotoVideo>? PhotoVideos { get; set; }
    }
}
