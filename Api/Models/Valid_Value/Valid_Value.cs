using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Valid_Value
{
    // Entity model for valid values for fields
    public class ValidValue
    {
        // Primary key: unique ID for this valid value record
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ValueId { get; set; }

        // Name of the field this valid value applies to
        [StringLength(100)]
        public string FieldName { get; set; } = string.Empty;

        // The valid value itself 
        [StringLength(255)]
        public string ValidValueName { get; set; } = string.Empty;

        // Description or notes about this valid value
        public string Description { get; set; } = string.Empty;
    }
}
