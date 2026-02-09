using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class ProfilePicture
    {
        public int Id { get; set; }
        [ForeignKey("Coach")]
        public int CoachId { get; set; }
        public virtual Coach Coach { get; set; }
        public string PicturePath { get; set; }
    }
}
