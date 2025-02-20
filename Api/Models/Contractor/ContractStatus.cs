using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Contractor
{
    public class ContractStatus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ContractStatusId { get; set; } // contract_status_id

        [Required]
        [StringLength(100)]
        public string ContractStatusName { get; set; } // contract_status

        // Navigasjonsegenskap: Alle kontrakter med denne statusen
        public ICollection<Contractor> Contractors { get; set; }
    }
}
