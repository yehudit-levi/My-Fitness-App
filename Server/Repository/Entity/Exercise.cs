using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class Exercise
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string? Min { get; set; }
        public string? ImageOrVideo { get; set; }
        public string? Category { get; set; }
        public string? Difficulty { get; set; }
        public DateTime PublishDate { get; set; }
        [ForeignKey("Coach")]
        public int CoachId { get; set; }
        public virtual Coach? Coach { get; set; }
        public ICollection<User>? FavoriteExercises { get; set; } = new HashSet<User>();

        // public List<int>? FavoriteExercises { get; set; }
    }
}
