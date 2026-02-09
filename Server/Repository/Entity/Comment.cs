//using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Repository.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }=string.Empty;
        public DateTime CommentDate { get; set; }

        public int UserId { get; set; }
        public virtual User? User { get; set; }

        public int ExerciseId { get; set; }
        
        public virtual Exercise? Exercise { get; set; }
    }
}



