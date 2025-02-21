using System;

namespace DTOs.Cruise_Dto
{
    public class CruiseDto
    {
        public int CruiseId { get; set; }
        public int ContractorId { get; set; }
        public string CruiseName { get; set; }
        public string ResearchVessel { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
