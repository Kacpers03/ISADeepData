using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Qualifiers
{
    public class Qualifier
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int QualifierId { get; set; } // qualifier_id

        [StringLength(100)]
        public string? QualifierCode { get; set; } // qualifier_code

        public string? QualifierDefinition { get; set; } // qualifier_definition
    }
}