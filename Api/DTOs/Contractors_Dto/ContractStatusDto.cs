using System;

namespace DTOs.Contractors_Dto
{
    // DTO for contract status information
    public class ContractStatusDto
    {
        // Unique ID of the contract status
        public int ContractStatusId { get; set; }

        // Name of the status (e.g., active, inactive)
        public string? ContractStatusName { get; set; }
    }
}
