using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    [Table("CoachRequests")]
    public class CoachRequests
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? CertificationPath { get; set; }
        public string? ProfilePicturePath { get; set; }
        public string? Token { get; set; }
    }
}
