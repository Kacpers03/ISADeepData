using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Cruises;
using Models.Librarys;

namespace Models.Contractors
{
    public class Contractor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ContractorId { get; set; } // contractor_id

        [Required]
        [StringLength(255)]
        public string ContractorName { get; set; } = string.Empty;

        // Utenlandsk nøkkel: Hvilken kontrakttype kontrakten tilhører
        public int ContractTypeId { get; set; }
        [ForeignKey("ContractTypeId")]
        public ContractType? ContractType { get; set; }

        [StringLength(100)]
        public string ContractNumber { get; set; } = string.Empty;

        [StringLength(100)]
        public string SponsoringState { get; set; } = string.Empty;

        // Utenlandsk nøkkel: Status for kontrakten
        public int ContractStatusId { get; set; }
        [ForeignKey("ContractStatusId")]
        public ContractStatus? ContractStatus { get; set; }

        public int ContractualYear { get; set; } // contractual_year

        public string Remarks { get; set; } = string.Empty;

        // Navigasjonsegenskaper til tilknyttede data
        public ICollection<ContractorArea>? ContractorAreas { get; set; }
        public ICollection<Cruise>? Cruises { get; set; }
        public ICollection<Library>? Libraries { get; set; }
    }
}