using System;

namespace  DTOs.Contractors_Dto
{
    public class ContractorAreaBlockDto
    {
        public int BlockId { get; set; }
    public int AreaId { get; set; }
    public string AreaName { get; set; }
    public int ContractorId { get; set; }
    public string ContractorName { get; set; }
    public string BlockName { get; set; }
    public string BlockDescription { get; set; }
    public string Status { get; set; }
    public double CenterLatitude { get; set; }
    public double CenterLongitude { get; set; }
    public double AreaSizeKm2 { get; set; }
     public string Category { get; set; } 

    }
}
