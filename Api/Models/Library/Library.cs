using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Contractors;

namespace Models.Librarys
{
    // Entity model for library documents linked to contractors
    public class Library
    {
        // Primary key: unique ID for the library record
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LibraryId { get; set; }

        // Foreign key: ID of the contractor who submitted the document
        public int ContractorId { get; set; }
        [ForeignKey("ContractorId")]
        public Contractor Contractor { get; set; }

        // Theme or category of the document
        [StringLength(255)]
        public string Theme { get; set; }

        // Original filename stored in the library
        [StringLength(255)]
        public string FileName { get; set; }

        // Title of the document
        [StringLength(255)]
        public string Title { get; set; }

        // Description or summary of the document content
        public string Description { get; set; }

        // Year associated with the document (e.g., publication year)
        public int Year { get; set; }

        // Country related to the document's content or origin
        public string Country { get; set; }

        // Date when the document was submitted to the library
        public DateTime SubmissionDate { get; set; }

        // Flag indicating if the document is confidential
        public bool IsConfidential { get; set; }
    }
}
