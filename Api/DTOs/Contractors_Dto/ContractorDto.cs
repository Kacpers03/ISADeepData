using System;

namespace DTOs.Contractors_Dto
{
    public class ContractorDto
    {
        public int ContractorId { get; set; }
        public string? ContractorName { get; set; }
        public int ContractTypeId { get; set; }
        public int ContractStatusId { get; set; }
        public string? ContractNumber { get; set; }
        public string? SponsoringState { get; set; }
        public int ContractualYear { get; set; }
        public string? Remarks { get; set; }
    }
}