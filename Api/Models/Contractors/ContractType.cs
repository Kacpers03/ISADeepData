using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Contractors
{
    // Entity model for a contract type
    public class ContractType
    {
        // Primary key: unique ID for the contract type
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ContractTypeId { get; set; }

        // Name of the contract type (e.g., research, monitoring)
        [Required]
        [StringLength(100)]
        public string ContractTypeName { get; set; } = string.Empty;

        // Navigation property: list of contractors with this contract type
        public ICollection<Contractor>? Contractors { get; set; }
    }
}
