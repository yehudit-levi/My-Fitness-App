using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Common
{
    public class CoachRequestDto
    {
        public int Id { get; set; } = 0;
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? CertificationPath { get; set; }
        public string? ProfilePicturePath { get; set; }
        public string? Token { get; set; }
        public IFormFile? Certification { get; set; }
        public IFormFile? ProfilePicture { get; set; }
       
    }
}
