using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class UserDto
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Min { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? ProfilePicturePath { get; set; }
        public string? Token { get; set; }
        public bool IsCoach { get; set; } = false;
        public string? CertificationPath { get; set; }
        public IFormFile? ProfilePicture { get; set; }

        //public List<int>? FavoriteExercises { get; set; }
        //public List<int>? CommentsOnExercises { get; set; } 
    }
}
