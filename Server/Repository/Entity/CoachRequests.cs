using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    // בקשת שדרוג ממשתמש רגיל למאמן - מפנה למשתמש קיים (UserId) במקום לשכפל
    // שם/מייל/סיסמה משלה (איחוד המבנה: מאמן הוא משתמש רגיל עם IsCoach=true).
    [Table("CoachRequests")]
    public class CoachRequests
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? CertificationPath { get; set; }
    }
}
