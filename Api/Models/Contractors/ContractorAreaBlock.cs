using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Contractors
{
    public class ContractorAreaBlock
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BlockId { get; set; } // block_id

        // Utenlandsk nøkkel: Hvilket område tilhører denne blokken
        public int AreaId { get; set; }
        [ForeignKey("AreaId")]
        public ContractorArea ContractorArea { get; set; }

        [Required]
        [StringLength(255)]
        public string BlockName { get; set; } // block_name

        public string BlockDescription { get; set; } // block_description

        [StringLength(100)]
        public string Status { get; set; } // status
    }
}
