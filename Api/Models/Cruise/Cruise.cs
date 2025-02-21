
using System.Collections.Generic;
using System;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Models.Stations;





namespace Models.Cruises
{
    public class Cruise
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CruiseId { get; set; } // cruise_id

        // Utenlandsk nøkkel: Hvilken Contractor tilhører dette cruiset?
        public int ContractorId { get; set; }
        [ForeignKey("ContractorId")]
        public Contractor Contractor { get; set; }

        [Required]
        [StringLength(255)]
        public string CruiseName { get; set; } // cruise_name

        [StringLength(255)]
        public string ResearchVessel { get; set; } // research_vessel

        public DateTime StartDate { get; set; } // start_date
        public DateTime EndDate { get; set; }   // end_date

        // Navigasjon: Liste av stasjoner på dette cruiset
        public ICollection<Station> Stations { get; set; }
    }
}
