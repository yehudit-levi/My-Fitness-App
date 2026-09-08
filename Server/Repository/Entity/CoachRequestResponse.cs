using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    // מחזירים למנהל תצוגה "מאוחדת" של בקשת השדרוג יחד עם הפרטים הרלוונטיים
    // של המשתמש המבקש (שם/מייל), כדי שעמוד הניהול יוכל להציג אותם בלי לדעת
    // בעצמו איך למפות בין הבקשה למשתמש.
    public class CoachRequestResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? CertificationPath { get; set; }
        public FileContentResult? CertificationData { get; set; }
    }
}
