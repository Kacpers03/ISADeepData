using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Contractors
{
    public class ContractorArea
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AreaId { get; set; }

        // Utenlandsk nøkkel: Hvilken Contractor tilhører dette området
        public int ContractorId { get; set; }
        [ForeignKey("ContractorId")]
        public Contractor Contractor { get; set; }

        [Required]
        [StringLength(255)]
        public string AreaName { get; set; }

        public string AreaDescription { get; set; }
        
        // Nye GeoJSON-relaterte felt
        public string GeoJsonBoundary { get; set; }
        public double CenterLatitude { get; set; }
        public double CenterLongitude { get; set; }
        public double TotalAreaSizeKm2 { get; set; }
        public DateTime AllocationDate { get; set; }
        public DateTime ExpiryDate { get; set; }

        // Navigasjon: Blokker tilknyttet området
        public ICollection<ContractorAreaBlock> ContractorAreaBlocks { get; set; }
    }
}