using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Contractor
{
    public class ValidValue
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ValueId { get; set; } // value_id

        [StringLength(100)]
        public string FieldName { get; set; } // field_name

        [StringLength(255)]
        public string ValidValueName { get; set; } // valid_value

        public string Description { get; set; } // description
    }
}
