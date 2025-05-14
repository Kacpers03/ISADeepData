using System;

namespace DTOs.Contractors_Dto
{
    // DTO for contract type information
    public class ContractTypeDto
    {
        // Unique ID of the contract type
        public int ContractTypeId { get; set; }

        // Name of the contract type 
        public string? ContractTypeName { get; set; }
    }
}
