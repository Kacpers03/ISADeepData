using System.Collections.Generic;

namespace Api.DTOs.Contractor
{
    public class ContractorDto
    {
        public int ContractorId { get; set; }
        public string ContractorName { get; set; }
        public int ContractTypeId { get; set; }
        public string ContractNumber { get; set; }
        public string SponsoringState { get; set; }
        public int ContractStatusId { get; set; }
        public int ContractualYear { get; set; }
        public string Remarks { get; set; }

        // Valgfritt: Inkluder relaterte data
        public ContractTypeDto ContractType { get; set; }
        public ContractStatusDto ContractStatus { get; set; }
        public List<ContractorAreaDto> ContractorAreas { get; set; }
    }
}
