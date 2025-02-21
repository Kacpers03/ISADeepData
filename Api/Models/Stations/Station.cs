using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Cruises;
using Models.Samples;
using Models.CTD_Data;

namespace Models.Stations
{
    public class Station
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StationId { get; set; } // station_id

        // Utenlandsk nøkkel: Hvilket Cruise tilhører denne stasjonen?
        public int CruiseId { get; set; }
        [ForeignKey("CruiseId")]
        public Cruise Cruise { get; set; }

        [StringLength(100)]
        public string StationCode { get; set; } // station_code

        [StringLength(100)]
        public string StationType { get; set; } // station_type (f.eks. POINT, TRAWL)

        public double Latitude { get; set; }  // latitude
        public double Longitude { get; set; } // longitude

        // Navigasjon: Samples + CTD-data
        public ICollection<Sample> Samples { get; set; }
        public ICollection<CTDData> CtdDataSet { get; set; }
    }
}
