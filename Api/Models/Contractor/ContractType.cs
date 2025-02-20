using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Contractor
{
    public class ContractType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ContractTypeId { get; set; } // contract_type_id

        [Required]
        [StringLength(100)]
        public string ContractTypeName { get; set; } // contract_type

        // Navigasjonsegenskap: Alle kontrakter som tilhører denne typen
        public ICollection<Contractor> Contractors { get; set; }
    }
}
