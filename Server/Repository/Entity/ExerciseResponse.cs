using Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class ExerciseResponse
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string? Min { get; set; }
        public string? ImageOrVideo { get; set; }
        public string? Category { get; set; }
        public string? Difficulty { get; set; }
        public DateTime? PublishDate { get; set; } = null;
        [ForeignKey("Coach")]
        public int CoachId { get; set; }
        public List<int>? FavoriteExercises { get; set; }
        public IFormFile? VideoUrl { get; set; }
        public List<CommentDto>? Comments { get; set; }
    }
}
