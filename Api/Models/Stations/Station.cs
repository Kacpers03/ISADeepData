using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Cruises;
using Models.Samples;
using Models.CTD_Data;
using Models.Contractors;

namespace Models.Stations
{
    public class Station
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StationId { get; set; }

        // Utenlandsk nøkkel: Hvilket Cruise tilhører denne stasjonen?
        public int CruiseId { get; set; }
        [ForeignKey("CruiseId")]
        public Cruise Cruise { get; set; }

        [StringLength(100)]
        public string StationCode { get; set; }

        [StringLength(100)]
        public string StationType { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // Ny kobling til ContractorAreaBlock
        public int? ContractorAreaBlockId { get; set; }
        [ForeignKey("ContractorAreaBlockId")]
        public ContractorAreaBlock ContractorAreaBlock { get; set; }

        // Navigasjon: Samples + CTD-data
        public ICollection<Sample> Samples { get; set; }
        public ICollection<CTDData> CtdDataSet { get; set; }
    }
}