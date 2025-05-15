using System;

namespace DTOs.ValidValue_Dto
{
    // DTO for valid values of a field
    public class ValidValueDto
    {
        // Unique ID of the valid value record
        public int ValueId { get; set; }

        // Name of the field this value applies to
        public string? FieldName { get; set; }

        // The valid value itself (e.g., a code or label)
        public string? ValidValueName { get; set; }

        // Description or notes about this valid value
        public string? Description { get; set; }
    }
}
