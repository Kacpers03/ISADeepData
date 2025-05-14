using System;

namespace DTOs.CTDData_Dto
{
    // DTO for CTD (Conductivity, Temperature, Depth) data measurements
    public class CTDDataDto
    {
        // Unique ID of the CTD record
        public int CtdId { get; set; }

        // ID of the station where data was collected
        public int StationId { get; set; }

        // Depth in meters at which measurement was taken
        public double DepthM { get; set; }

        // Water temperature in Celsius
        public double TemperatureC { get; set; }

        // Salinity value (practical salinity units)
        public double Salinity { get; set; }

        // Dissolved oxygen concentration (e.g., mg/L)
        public double Oxygen { get; set; }

        // pH level of the water
        public double Ph { get; set; }

        // Date and time when the measurement was recorded
        public DateTime MeasurementTime { get; set; }
    }
}
