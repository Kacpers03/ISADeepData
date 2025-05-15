using System;

namespace DTOs.Qualifier_Dto
{
    // DTO for data qualifiers
    public class QualifierDto
    {
        // Unique ID of the qualifier
        public int QualifierId { get; set; }

        // Short code for the qualifier 
        public string? QualifierCode { get; set; }

        // Definition or description of the qualifier code
        public string? QualifierDefinition { get; set; }
    }
}
