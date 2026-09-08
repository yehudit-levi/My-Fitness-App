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
        public int UserId { get; set; }
        public string? CertificationPath { get; set; }
        public IFormFile? Certification { get; set; }
    }
}
