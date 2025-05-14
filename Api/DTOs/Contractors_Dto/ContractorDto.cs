using System;

namespace DTOs.Contractors_Dto
{
    // DTO for contractor main info
    public class ContractorDto
    {
        // Unique ID of the contractor
        public int ContractorId { get; set; }

        // Name of the contractor
        public string? ContractorName { get; set; }

        // ID of the contract type (e.g., research, monitoring)
        public int ContractTypeId { get; set; }

        // ID of the contract status (e.g., active, inactive)
        public int ContractStatusId { get; set; }

        // Official contract number or code
        public string? ContractNumber { get; set; }

        // State that sponsors this contract
        public string? SponsoringState { get; set; }

        // Year the contract was agreed
        public int ContractualYear { get; set; }

        // Extra notes or remarks about the contractor
        public string? Remarks { get; set; }
    }
}
