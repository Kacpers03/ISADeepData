using System;

namespace DTOs.CTDData_Dto
{
    public class CTDDataDto
    {
        public int CtdId { get; set; }
        public int StationId { get; set; }
        public double DepthM { get; set; }
        public double TemperatureC { get; set; }
        public double Salinity { get; set; }
        public double Oxygen { get; set; }
        public double Ph { get; set; }
        public DateTime MeasurementTime { get; set; }
    }
}
