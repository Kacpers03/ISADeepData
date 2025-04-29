using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Stations;

namespace Models.CTD_Data
{
    public class CTDData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CtdId { get; set; } // ctd_id

        // Utenlandsk nøkkel: Kobling til Station
        public int StationId { get; set; }
        [ForeignKey("StationId")]
        public Station? Station { get; set; }

        public double DepthM { get; set; }       // depth_m
        public double TemperatureC { get; set; } // temperature_c
        public double Salinity { get; set; }     // salinity
        public double Oxygen { get; set; }       // oxygen
        public double Ph { get; set; }           // ph

        public DateTime MeasurementTime { get; set; } // measurement_time
    }
}