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
        // הקשר "מאמן" של תרגיל מפנה כעת ל-User (אחרי איחוד המשתמש/מאמן למישות אחת) -
        // באותה צורה בדיוק כפי שהיה מפנה קודם ל-Coach: קשר חד-כיווני (בלי ICollection<Exercise> בצד ההפוך).
        [ForeignKey("Coach")]
        public int CoachId { get; set; }
        public virtual User? Coach { get; set; }
        public ICollection<User>? FavoriteExercises { get; set; } = new HashSet<User>();

        // public List<int>? FavoriteExercises { get; set; }
    }
}
