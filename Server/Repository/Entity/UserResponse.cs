//using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{

    public class UserResponse
    {

        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Min { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? ProfilePicturePath { get; set; }
        public string? Token { get; set; }
        // ProfilePicturePath מכיל כעת URL מלא (Cloudinary) - הלקוח משתמש בו ישירות כ-src של תמונה,
        // ואין יותר צורך לשלוח את בייטים של התמונה (base64) בתוך התגובה.
        public IFormFile? ProfilePicture { get; set; }
        public bool IsCoach { get; set; } = false;
        public string? CertificationPath { get; set; }

        //public ICollection<Exercise>? FavoriteExercises { get; set; } = new HashSet<Exercise>();
        //public ICollection<Comment>? CommentsOnExercises { get; set; } = new HashSet<Comment>();

    }
}
