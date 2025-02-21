using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Samples;

namespace Models.Photo_Video
{
    public class PhotoVideo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MediaId { get; set; } // media_id

        // Utenlandsk nøkkel: Hvilken Sample tilhører dette mediet?
        public int SampleId { get; set; }
        [ForeignKey("SampleId")]
        public Sample Sample { get; set; }

        [StringLength(255)]
        public string FileName { get; set; } // file_name

        [StringLength(50)]
        public string MediaType { get; set; } // media_type

        [StringLength(255)]
        public string CameraSpecs { get; set; } // camera_specs

        public DateTime CaptureDate { get; set; } // capture_date

        public string Remarks { get; set; } // remarks
    }
}
