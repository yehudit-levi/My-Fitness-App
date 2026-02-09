using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class CoachConfirmationRequest
    {
        public string? CoachEmail { get; set; }
        public string? ConfirmationCode { get; set; }
    }
}
