using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class ProfilePictureDto
    {
        public int Id { get; set; }
        public string? PicturePath { get; set; }
        public IFormFile? Picture { get; set; }

        public int CoachId { get; set; }
    }
}
