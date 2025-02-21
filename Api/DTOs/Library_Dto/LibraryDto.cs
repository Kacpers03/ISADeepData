using System;

namespace DTOs.Library_Dto
{
    public class LibraryDto
    {
        public int LibraryId { get; set; }
        public int ContractorId { get; set; }
        public string Theme { get; set; }
        public string FileName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime SubmissionDate { get; set; }
        public bool IsConfidential { get; set; }
    }
}
