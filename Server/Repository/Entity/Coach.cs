using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Repository.Entity
{
    public class Coach
    {
        public int Id { get; set; } 
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? CertificationPath { get; set; }
        public string? ProfilePicturePath { get; set; }
        public string? Token { get; set; }

        // public string? CertificationData { get; set; }
    }
}
