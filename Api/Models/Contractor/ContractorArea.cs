using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Contractor
{
    public class ContractorArea
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AreaId { get; set; } // area_id

        // Utenlandsk nøkkel: Hvilken kontrakt området tilhører
        public int ContractorId { get; set; }
        [ForeignKey("ContractorId")]
        public Contractor Contractor { get; set; }

        [Required]
        [StringLength(255)]
        public string AreaName { get; set; } // area_name

        public string AreaDescription { get; set; } // area_description

        // Navigasjonsegenskap: Blokker knyttet til området
        public ICollection<ContractorAreaBlock> ContractorAreaBlocks { get; set; }
    }
}
