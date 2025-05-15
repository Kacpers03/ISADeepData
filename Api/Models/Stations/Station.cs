using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Cruises;
using Models.Samples;
using Models.CTD_Data;
using Models.Contractors;

namespace Models.Stations
{
    // Entity model for a sampling station on a cruise
    public class Station
    {
        // Primary key: unique ID for the station
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StationId { get; set; }

        // Foreign key: ID of the cruise this station is part of
        public int CruiseId { get; set; }
        [ForeignKey("CruiseId")]
        public Cruise? Cruise { get; set; }

        // Code or label for the station
        [StringLength(100)]
        public string StationCode { get; set; } = string.Empty;

        // Type of station
        [StringLength(100)]
        public string StationType { get; set; } = string.Empty;

        // Geographic coordinates of the station
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // Optional link to a contractor area block
        public int? ContractorAreaBlockId { get; set; }
        [ForeignKey("ContractorAreaBlockId")]
        public ContractorAreaBlock? ContractorAreaBlock { get; set; }

        // Navigation properties: related data sets
        // Samples collected at this station
        public ICollection<Sample>? Samples { get; set; }
        // CTD data readings at this station
        public ICollection<CTDData>? CtdDataSet { get; set; }
    }
}
