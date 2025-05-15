using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Stations;

namespace Models.CTD_Data
{
    // Entity model for CTD (Conductivity, Temperature, Depth) measurements
    public class CTDData
    {
        // Primary key: unique ID of the CTD record
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CtdId { get; set; }

        // Foreign key: ID of the station where the measurement was taken
        public int StationId { get; set; }
        [ForeignKey("StationId")]
        public Station? Station { get; set; }

        // Depth in meters at which the measurement was recorded
        public double DepthM { get; set; }

        // Water temperature in Celsius
        public double TemperatureC { get; set; }

        // Salinity measured in practical salinity units (PSU)
        public double Salinity { get; set; }

        // Dissolved oxygen concentration (e.g., mg/L)
        public double Oxygen { get; set; }

        // pH level of the water
        public double Ph { get; set; }

        // Date and time when the measurement was taken
        public DateTime MeasurementTime { get; set; }
    }
}
