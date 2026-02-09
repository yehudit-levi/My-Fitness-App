using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class MiniExerciseResponse
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string? Min { get; set; }
        public string? ImageOrVideo { get; set; }
        public string? Category { get; set; }
        public string? Difficulty { get; set; }
        public int CoachId { get; set; }
    }
}
