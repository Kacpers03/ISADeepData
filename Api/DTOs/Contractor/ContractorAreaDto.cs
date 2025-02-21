using System.Collections.Generic;

namespace Api.DTOs.Contractor
{
    public class ContractorAreaDto
    {
        public int AreaId { get; set; }
        public int ContractorId { get; set; }
        public string AreaName { get; set; }
        public string AreaDescription { get; set; }

        // Valgfritt: Inkluder blokker knyttet til området
        public List<ContractorAreaBlockDto> ContractorAreaBlocks { get; set; }
    }
}
