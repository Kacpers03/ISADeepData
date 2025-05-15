using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models.Contractors;
using Models.Stations;

namespace Models.Cruises
{
    // Entity model for a research cruise
    public class Cruise
    {
        // Primary key: unique ID for the cruise
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CruiseId { get; set; }

        // Foreign key: ID of the contractor who organized this cruise
        public int ContractorId { get; set; }
        [ForeignKey("ContractorId")]
        public Contractor Contractor { get; set; }

        // Name or code of the cruise
        [Required]
        [StringLength(255)]
        public string CruiseName { get; set; }

        // Name of the research vessel used
        [StringLength(255)]
        public string ResearchVessel { get; set; }

        // Date when the cruise starts
        public DateTime StartDate { get; set; }

        // Date when the cruise ends
        public DateTime EndDate { get; set; }

        // Navigation property: list of stations on this cruise
        public ICollection<Station> Stations { get; set; }
    }
}
