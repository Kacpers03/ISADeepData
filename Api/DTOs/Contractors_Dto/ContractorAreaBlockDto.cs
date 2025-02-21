using System;

namespace  DTOs.Contractors_Dto
{
    public class ContractorAreaBlockDto
    {
        public int BlockId { get; set; }
        public int AreaId { get; set; }
        public string BlockName { get; set; }
        public string BlockDescription { get; set; }
        public string Status { get; set; }
    }
}
