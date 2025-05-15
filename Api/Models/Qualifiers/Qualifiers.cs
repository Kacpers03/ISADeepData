using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Qualifiers
{
    // Entity model for data qualifiers
    public class Qualifier
    {
        // Primary key: unique ID for the qualifier record
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int QualifierId { get; set; }

        // Code symbol for the qualifier 
        [StringLength(100)]
        public string? QualifierCode { get; set; }

        // Definition or description of what the qualifier means
        public string? QualifierDefinition { get; set; }
    }
}
