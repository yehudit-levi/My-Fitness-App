//using Azure.Core;
using Common;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repository.Entity;
using Repository.Repositories;
using Service;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Path = System.IO.Path;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IService<UserDto> service;
        private readonly IConfiguration config;

        public UserController(IService<UserDto> userService, IConfiguration config)
        {
            this.service = userService;
            this.config = config;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var users = await service.GetAllAsync();
            var displayImages = new List<UserResponse>();
            foreach (var i in users)
            {
                UserResponse user = new UserResponse()
                {
                    Id = i.Id,
                    Username = i.Username,
                    Min = i.Min,
                    Email = i.Email,
                    Password = i.Password,
                    ProfilePicturePath = i.ProfilePicturePath,
                    ProfilePicture = i.ProfilePicture,
                    Token = i.Token,
                    ProfilePictureData = null,
                    IsCoach = i.IsCoach,
                    CertificationPath = i.CertificationPath,
                };
                displayImages.Add(user);
            }
            return Ok(displayImages);
        }

        [HttpGet("image/{id}")]
        public async Task<IActionResult> GetProfileImage(int id)
        {
            var user = await service.GetByIdAsync(id);
            if (user == null || string.IsNullOrEmpty(user.ProfilePicturePath)) return NotFound();

            var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, user.ProfilePicturePath.TrimStart('\\', '/'));

            if (!System.IO.File.Exists(filePath)) return NotFound("File not found on disk");

            var bytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(bytes, "image/jpeg");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await service.GetByIdAsync(id);

            if (user != null)
            {
                UserResponse userResponse = new UserResponse()
                {
                    Id = user.Id,
                    Username = user.Username,
                    Min = user.Min,
                    Email = user.Email,
                    Password = user.Password,
                    ProfilePicturePath = user.ProfilePicturePath,
                    ProfilePicture = user.ProfilePicture,
                    Token = user.Token,
                    ProfilePictureData = null,
                    IsCoach = user.IsCoach,
                    CertificationPath = user.CertificationPath,
                };
                return Ok(userResponse);
            }
            return NotFound();
        }

        [HttpPost("Post")]
        public async Task<IActionResult> Post([FromForm] UserDto data)
        {
            if (data.ProfilePicture == null || data.ProfilePicture.Length == 0)
                return BadRequest("No file uploaded");

            if (!data.ProfilePicture.ContentType.StartsWith("image/"))
                return BadRequest("Uploaded file is not an image");

            // ולידציה: לא מאפשרים להירשם עם כתובת מייל שכבר קיימת במערכת (לא תלוי-רישיות)
            if (string.IsNullOrWhiteSpace(data.Email))
                return BadRequest("כתובת אימייל היא שדה חובה");

            var existingUsers = await service.GetAllAsync();
            bool emailAlreadyExists = existingUsers.Any(u => u.Email != null
                && u.Email.Trim().ToLower() == data.Email.Trim().ToLower());
            if (emailAlreadyExists)
                return Conflict("כבר קיים משתמש רשום עם כתובת האימייל הזו");

            UserDto res = await service.AddItemAsync(data);
            return Ok(res);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UserDto value)
        {
            // עדכון "בטוח": שולפים קודם את המשתמש המלא מה-DB וממזגים לתוכו רק את השדות
            // הניתנים לעריכה מטופס הפרופיל הרגיל. חשוב כי updateAsync בשכבת ה-Repository
            // מבצע Update מלא (overwrite) של כל האובייקט - אם היינו שולחים ישירות את value
            // (כפי שמגיע מטופס עדכון הפרופיל, בלי IsCoach/CertificationPath), זה היה מאפס
            // בטעות את סטטוס ה"מאמן" של כל משתמש שמעדכן את הפרופיל שלו.
            var existing = await service.GetByIdAsync(id);
            if (existing == null) return NotFound();

            existing.Username = value.Username;
            existing.Min = value.Min;
            existing.Email = value.Email;
            existing.Password = value.Password;
            if (!string.IsNullOrWhiteSpace(value.ProfilePicturePath))
                existing.ProfilePicturePath = value.ProfilePicturePath;
            // IsCoach, CertificationPath ו-Token לא ניתנים לעדכון דרך טופס עדכון הפרופיל הרגיל -
            // הם נשארים כפי שהיו.

            await service.UpdateAsync(existing);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await service.DeleteByIdAsync(id);
            return Ok();
        }

        [HttpPost("AddExercise")]
        public async Task<IActionResult> AddExercise([FromBody] AddExerciseRequest requests)
        {
            await service.AddFavoriteExercise(requests);
            return Ok();
        }

        public class UserResponseWithToken
        {
            public string Token { get; set; }
            // השם "User" (ולא "UserResponse") חשוב: הוא קובע את שם המפתח ב-JSON שחוזר ללקוח,
            // וכל קוד ה-React (NavBar, personalZone וכו') כבר מצפה לשדה בשם "user".
            public UserResponse User { get; set; }
        }

        [HttpPost("logIn/{email}/{password}")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var user = Authenticate(email, password);
            if (user != null)
            {
                var token = Generate(user);

                // הגנה: אם טעינת התמונה נכשלת מכל סיבה (קובץ חסר/נתיב לא תקין וכו'),
                // לא רוצים שכל תהליך ההתחברות ייכשל (500) בגללה - פשוט לא תוצג תמונה.
                FileContentResult profilePictureData = null;
                try
                {
                    profilePictureData = ImageHelper.GetImageAsync(user, user.ProfilePicturePath) as FileContentResult;
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"Failed to load profile picture for user {user.Id}: {ex.Message}");
                }

                var userResponse = new UserResponse
                {
                    Id = user.Id,
                    Username = user.Username,
                    Min = user.Min,
                    Email = user.Email,
                    ProfilePicturePath = user.ProfilePicturePath,
                    Token = token,
                    ProfilePictureData = profilePictureData,
                    IsCoach = user.IsCoach,
                    CertificationPath = user.CertificationPath,
                };

                return Ok(new UserResponseWithToken() { Token = token, User = userResponse });
            }
            return Unauthorized();
        }

        private string Generate(UserDto user)
        {
            var securitykey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            var credentials = new SigningCredentials(securitykey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
            };
            var token = new JwtSecurityToken(config["Jwt:Issuer"], config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private UserDto Authenticate(string email, string password)
        {
            var CurrentUser = service.GetAllAsync().Result.FirstOrDefault(x => x.Email.ToLower() == email.ToLower()
            && x.Password == password);
            if (CurrentUser != null)
                return CurrentUser;
            return null;
        }

        private string GetMimeType(string filePath)
        {
            var extension = Path.GetExtension(filePath).ToLowerInvariant();
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };
        }
    }
}