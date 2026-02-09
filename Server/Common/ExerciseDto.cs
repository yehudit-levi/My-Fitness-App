using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class ExerciseDto
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string? Min { get; set; }
        public string? ImageOrVideo { get; set; }
        public string? Category { get; set; }
        public string? Difficulty { get; set; }
        public DateTime? PublishDate { get; set; } = null;
        [ForeignKey("Coach")]
        public int CoachId { get; set;}
        public List<int>? FavoriteExercises { get; set; }
        public IFormFile? VideoUrl { get; set; }
    }
}
