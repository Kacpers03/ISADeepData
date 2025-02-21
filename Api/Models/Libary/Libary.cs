using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Contractors;

namespace Models.Libarys
{
    public class Library
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LibraryId { get; set; } // library_id

        // Utenlandsk nøkkel: Hvilken Contractor tilhører dette dokumentet?
        public int ContractorId { get; set; }
        [ForeignKey("ContractorId")]
        public Contractor Contractor { get; set; }

        [StringLength(255)]
        public string Theme { get; set; } // theme

        [StringLength(255)]
        public string FileName { get; set; } // file_name

        [StringLength(255)]
        public string Title { get; set; } // title

        public string Description { get; set; } // description

        public DateTime SubmissionDate { get; set; } // submission_date

        public bool IsConfidential { get; set; } // is_confidential
    }
}
