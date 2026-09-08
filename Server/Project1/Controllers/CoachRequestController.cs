using Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.Entity;
using Repository.Repositories;
using Service;
using System.Net.Mail;
using System.Net;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoachRequestController : ControllerBase
    {
        private readonly IConfiguration config;
        private readonly IService<CoachRequestDto> serviceRequest;
        private readonly IService<UserDto> userService;

        public CoachRequestController(IService<CoachRequestDto> coachRequestService, IConfiguration config, IService<UserDto> userService)
        {
            this.serviceRequest = coachRequestService;
            this.config = config;
            this.userService = userService;
        }

        // עמוד הניהול (PendingCoachesList) - רשימת כל הבקשות הממתינות, מאוחדות עם פרטי המשתמש המבקש.
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var requests = await serviceRequest.GetAllAsync();
            var responses = new List<CoachRequestResponse>();

            foreach (var request in requests)
            {
                var user = await userService.GetByIdAsync(request.UserId);
                if (user == null) continue;

                var certImage = ImageHelper.GetImageAsync(request, request.CertificationPath);

                responses.Add(new CoachRequestResponse
                {
                    Id = request.Id,
                    UserId = request.UserId,
                    Username = user.Username,
                    Email = user.Email,
                    CertificationPath = request.CertificationPath,
                    CertificationData = certImage as FileContentResult,
                });
            }

            return Ok(responses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var request = await serviceRequest.GetByIdAsync(id);
            if (request == null) return NotFound();

            var user = await userService.GetByIdAsync(request.UserId);
            if (user == null) return NotFound();

            var certImage = ImageHelper.GetImageAsync(request, request.CertificationPath);

            var response = new CoachRequestResponse
            {
                Id = request.Id,
                UserId = request.UserId,
                Username = user.Username,
                Email = user.Email,
                CertificationPath = request.CertificationPath,
                CertificationData = certImage as FileContentResult,
            };

            return Ok(response);
        }

        // בודק אם למשתמש נתון יש כרגע בקשת שדרוג ממתינה - משמש את האזור האישי כדי להסתיר
        // את כפתור "הצטרפו כמאמנים" ולהציג "הבקשה שלך ממתינה לאישור" במקום.
        [HttpGet("mine/{userId}")]
        public async Task<IActionResult> GetMine(int userId)
        {
            var requests = await serviceRequest.GetAllAsync();
            var mine = requests.FirstOrDefault(r => r.UserId == userId);
            if (mine == null) return NotFound();
            return Ok(mine);
        }

        // שליחת בקשת שדרוג ל"מאמן" עבור משתמש קיים ומחובר (לא הרשמה חדשה - ראו הערה בהמשך הקובץ).
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] CoachRequestDto data)
        {
            if (data.UserId <= 0)
                return BadRequest("יש להתחבר לפני שליחת בקשת שדרוג למאמן");

            if (data.Certification == null || data.Certification.Length == 0)
                return BadRequest("יש להעלות תעודת הסמכה");

            if (!data.Certification.ContentType.StartsWith("image/"))
                return BadRequest("Uploaded file is not an image");

            var user = await userService.GetByIdAsync(data.UserId);
            if (user == null)
                return NotFound("משתמש לא נמצא");

            // ולידציה: משתמש שכבר מאמן, ומשתמש עם בקשה ממתינה קיימת - לא יכולים לשלוח בקשה נוספת.
            if (user.IsCoach)
                return Conflict("המשתמש כבר רשום כמאמן/ת");

            var pendingRequests = await serviceRequest.GetAllAsync();
            bool alreadyPending = pendingRequests.Any(r => r.UserId == data.UserId);
            if (alreadyPending)
                return Conflict("כבר קיימת בקשת שדרוג ממתינה לאישור עבור משתמש זה");

            // שליחת מייל התראה למנהל היא פעולה משנית - כשלון שלה לא אמור להפיל את יצירת הבקשה עצמה.
            try
            {
                await SendEmailToAdmin(user);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to send coach-request admin notification email: {ex.Message}");
            }

            // העלאת הקובץ (בתוך AddItemAsync) יכולה להיכשל עם ArgumentException אם סוג הקובץ לא נתמך -
            // תופסים את זה כאן ומחזירים הודעה ברורה במקום 500 גנרי.
            try
            {
                CoachRequestDto requestDto = await serviceRequest.AddItemAsync(data);
                return Ok(requestDto.Id);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // אישור בקשת שדרוג ע"י המנהל: המשתמש הופך למאמן (IsCoach=true) - לא נוצרת רשומה כפולה.
        [HttpPost("approve/{id}")]
        public async Task<IActionResult> ApproveCoach(int id)
        {
            var request = await serviceRequest.GetByIdAsync(id);
            if (request == null) return NotFound();

            // שולפים את המשתמש המלא וממזגים לתוכו רק את השדות הרלוונטיים לפני השמירה -
            // בדיוק כמו ב-UserController.Put, כדי לא לאפס בטעות שדות אחרים שלו (updateAsync הוא Update מלא).
            var user = await userService.GetByIdAsync(request.UserId);
            if (user == null) return NotFound("משתמש לא נמצא");

            user.IsCoach = true;
            user.CertificationPath = request.CertificationPath;
            await userService.UpdateAsync(user);

            try
            {
                await SendDecisionEmailToCoach(user.Email, user.Username, approved: true);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Failed to send coach approval email: {ex.Message}");
            }

            await serviceRequest.DeleteByIdAsync(id);
            return Ok();
        }

        // דחיית בקשת שדרוג ע"י המנהל - מוחקים את הבקשה, המשתמש נשאר כפי שהיה (לא הופך למאמן).
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var request = await serviceRequest.GetByIdAsync(id);
            if (request != null)
            {
                var user = await userService.GetByIdAsync(request.UserId);
                if (user != null)
                {
                    try
                    {
                        await SendDecisionEmailToCoach(user.Email, user.Username, approved: false);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine($"Failed to send coach rejection email: {ex.Message}");
                    }
                }
            }

            await serviceRequest.DeleteByIdAsync(id);
            return Ok();
        }

        private async Task SendDecisionEmailToCoach(string? toEmail, string? username, bool approved)
        {
            string smtpServer = config["EmailSettings:SmtpServer"];
            string emailFrom = config["EmailSettings:SenderEmail"];
            string senderName = config["EmailSettings:SenderName"];
            string password = config["EmailSettings:Password"];
            int port = int.TryParse(config["EmailSettings:Port"], out var parsedPort) ? parsedPort : 587;

            if (string.IsNullOrWhiteSpace(toEmail) || string.IsNullOrWhiteSpace(emailFrom) || string.IsNullOrWhiteSpace(password))
            {
                return;
            }

            MailAddress from = new MailAddress(emailFrom, senderName);
            MailAddress to = new MailAddress(toEmail);

            using (SmtpClient smtpClient = new SmtpClient(smtpServer))
            {
                smtpClient.Port = port;
                smtpClient.Credentials = new NetworkCredential(emailFrom, password);
                smtpClient.EnableSsl = true;
                smtpClient.UseDefaultCredentials = false;

                using (MailMessage message = new MailMessage(from, to))
                {
                    message.Subject = approved ? "בקשת השדרוג שלך למאמן/ת אושרה!" : "עדכון לגבי בקשת השדרוג שלך";
                    message.IsBodyHtml = true;
                    message.Body = approved
                        ? $@"
                <div dir='rtl'>
                    <h1>שלום {username},</h1>
                    <p>בקשתך להשתדרג למאמן/ת באתר אושרה בהצלחה! התחברי לחשבונך הקיים - האזור האישי שלך יציג כעת גם את אזור המאמנים.</p>
                    <br/>
                    <a href='http://localhost:3000/login' style='padding:10px; background-color:green; color:white; text-decoration:none;'>מעבר להתחברות</a>
                </div>"
                        : $@"
                <div dir='rtl'>
                    <h1>שלום {username},</h1>
                    <p>תודה על התעניינותך להשתדרג למאמן/ת באתר. לצערנו הבקשה שהגשת לא אושרה הפעם.</p>
                </div>";

                    await smtpClient.SendMailAsync(message);
                }
            }
        }

        private async Task SendEmailToAdmin(UserDto user)
        {
            string adminEmail = config["AdminSettings:AdminEmail"];
            string smtpServer = config["EmailSettings:SmtpServer"];
            string emailFrom = config["EmailSettings:SenderEmail"];
            string senderName = config["EmailSettings:SenderName"];
            string password = config["EmailSettings:Password"];
            int port = int.TryParse(config["EmailSettings:Port"], out var parsedPort) ? parsedPort : 587;

            if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(emailFrom) || string.IsNullOrWhiteSpace(password))
            {
                return;
            }

            MailAddress from = new MailAddress(emailFrom, senderName);
            MailAddress to = new MailAddress(adminEmail);

            using (SmtpClient smtpClient = new SmtpClient(smtpServer))
            {
                smtpClient.Port = port;
                smtpClient.Credentials = new NetworkCredential(emailFrom, password);
                smtpClient.EnableSsl = true;
                smtpClient.UseDefaultCredentials = false;

                using (MailMessage message = new MailMessage(from, to))
                {
                    message.Subject = "בקשת שדרוג למאמן ממתינה לאישור";
                    message.IsBodyHtml = true;
                    message.Body = $@"
                <div dir='rtl'>
                    <h1>בקשת שדרוג למאמן</h1>
                    <p>שם המשתמש: {user.Username}</p>
                    <p>אימייל: {user.Email}</p>
                    <br/>
                    <a href='http://localhost:3000/admin/pendingCoaches' style='padding:10px; background-color:green; color:white; text-decoration:none;'>מעבר לעמוד אישור מאמנים</a>
                </div>";

                    await smtpClient.SendMailAsync(message);
                }
            }
        }
    }
}
