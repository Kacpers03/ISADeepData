using System;

namespace  DTOs.Contractors_Dto
{
    public class ContractorAreaDto
    {
        public int AreaId { get; set; }
        public int ContractorId { get; set; }
        public string? AreaName { get; set; }
        public string? AreaDescription { get; set; }
        public double CenterLatitude { get; set; }
        public double CenterLongitude { get; set; }
        public double TotalAreaSizeKm2 { get; set; }
        public DateTime AllocationDate { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}