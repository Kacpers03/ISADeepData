using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Contractors
{
    // Entity model for a contract status
    public class ContractStatus
    {
        // Primary key: unique ID for the contract status
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ContractStatusId { get; set; }

        // Name of the contract status (e.g., active, inactive)
        [Required]
        [StringLength(100)]
        public string ContractStatusName { get; set; } = string.Empty;

        // Navigation property: list of contractors with this status
        public ICollection<Contractor>? Contractors { get; set; }
    }
}
