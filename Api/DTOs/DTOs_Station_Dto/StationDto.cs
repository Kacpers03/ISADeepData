using System;

namespace DTOs.Station_Dto
{
    public class StationDto
    {
        public int StationId { get; set; }
        public int CruiseId { get; set; }
        public string StationCode { get; set; }
        public string StationType { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
