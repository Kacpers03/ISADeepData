using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Samples;

namespace Models.Photo_Video
{
    // Entity model for photo or video media linked to a sample
    public class PhotoVideo
    {
        // Primary key: unique ID for the media record
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MediaId { get; set; }

        // Foreign key: ID of the sample this media belongs to
        public int SampleId { get; set; }
        [ForeignKey("SampleId")]
        public Sample? Sample { get; set; }

        // Original file name of the media
        [StringLength(255)]
        public string? FileName { get; set; }

        // Type of the media (e.g., photo, video)
        [StringLength(50)]
        public string? MediaType { get; set; }

        // Camera details used to capture the media
        [StringLength(255)]
        public string? CameraSpecs { get; set; }

        // Date when the media was captured
        public DateTime CaptureDate { get; set; }

        // Any additional remarks or notes about the media
        public string? Remarks { get; set; }
    }
}
