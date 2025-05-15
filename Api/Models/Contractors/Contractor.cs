using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Cruises;
using Models.Librarys;

namespace Models.Contractors
{
    // Entity model for a contractor
    public class Contractor
    {
        // Primary key: unique ID for the contractor
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ContractorId { get; set; }

        // Name of the contractor company or organization
        [Required]
        [StringLength(255)]
        public string ContractorName { get; set; } = string.Empty;

        // Foreign key: ID of the contract type
        public int ContractTypeId { get; set; }
        [ForeignKey("ContractTypeId")]
        public ContractType? ContractType { get; set; }

        // Official contract number or reference code
        [StringLength(100)]
        public string ContractNumber { get; set; } = string.Empty;

        // State or country sponsoring the contract
        [StringLength(100)]
        public string SponsoringState { get; set; } = string.Empty;

        // Foreign key: ID of the contract status
        public int ContractStatusId { get; set; }
        [ForeignKey("ContractStatusId")]
        public ContractStatus? ContractStatus { get; set; }

        // Year the contract was signed or started
        public int ContractualYear { get; set; }

        // Any extra notes about the contractor or contract
        public string Remarks { get; set; } = string.Empty;

        // Navigation properties: related data collections
        // Areas allocated to this contractor
        public ICollection<ContractorArea>? ContractorAreas { get; set; }
        // Cruises organized by this contractor
        public ICollection<Cruise>? Cruises { get; set; }
        // Library entries linked to this contractor
        public ICollection<Library>? Libraries { get; set; }
    }
}
