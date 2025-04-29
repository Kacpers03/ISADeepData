using System;

namespace DTOs.ValidValue_Dto
{
    public class ValidValueDto
    {
        public int ValueId { get; set; }
        public string? FieldName { get; set; }
        public string? ValidValueName { get; set; }
        public string? Description { get; set; }
    }
}