using System;

namespace DTOs.Library_Dto
{
    // DTO for library file metadata
    public class LibraryDto
    {
        // Unique ID of the library record
        public int LibraryId { get; set; }

        // ID of the contractor who submitted the file
        public int ContractorId { get; set; }

        // Name of the contractor
        public string? Contractor { get; set; } 

        // Theme or category of the file
        public string? Theme { get; set; }

        // Original file name
        public string? FileName { get; set; }

        // Title given to the file
        public string? Title { get; set; }

        // Description or summary of the file
        public string? Description { get; set; }

        // Country associated with the content
        public string? Country { get; set; }

        // Date when the file was submitted
        public DateTime SubmissionDate { get; set; }

        // Year related to the file's content or submission
        public int Year { get; set; }

        // Whether the file is confidential
        public bool IsConfidential { get; set; }
    }
}
