using Azure.Core;
using Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.Entity;
using Service;
using System.Net.Mail;
using System.Net;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Google.Api.Ads.AdWords.v201809;
using DocumentFormat.OpenXml.Vml;
using Path = System.IO.Path;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Repository.Repositories;
using AutoMapper;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoachController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IService<CoachDto> service;
        private readonly IConfiguration config;
        private readonly CoachRequestsService _service;
        private readonly IService<CoachRequestDto> serviceRequest;
        private readonly IMapper mapper; // 1. הוספת המשתנה

        // GET: CoachController
        public CoachController(IService<CoachDto> coachService, IConfiguration config, IService<CoachRequestDto> coachServiceRequest, IMapper mapper)
        {
            this.service = coachService;
            this.config = config;
            this.serviceRequest = coachServiceRequest;
            this.mapper = mapper; // 3. השמה למשתנה הפרטי
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var coaches = await service.GetAllAsync();
            var displayImages = new List<CoachResponse>();
            coaches.ForEach(i =>
            {
                var image1 = ImageHelper.GetImageAsync(i,i.ProfilePicturePath);
                var image2 = ImageHelper.GetImageAsync(i, i.CertificationPath);
                if (image1 is not NotFoundResult)
                {
                    CoachResponse coach = new CoachResponse()
                    {
                        Id = i.Id,
                        FullName=i.FullName,
                        Email=i.Email,
                        Password=i.Password,                      
                        CertificationPath=i.CertificationPath,
                        ProfilePicturePath=i.ProfilePicturePath,
                        Certification=i.Certification,
                        ProfilePicture=i.ProfilePicture,
                        Token=i.Token,
                        CertificationData = (FileContentResult)image2,
                        ProfilePictureData = (FileContentResult)image1,
                };
                    
                    displayImages.Add(coach);
                }
            });
            return Ok(displayImages);
        }

        //[HttpPost]
        //public async Task<IActionResult> Post([FromForm] CoachRequestDto data)
        //{
        //    if ((data.Certification==null||data.Certification.Length==0)
        //        && (data.ProfilePicture==null||data.ProfilePicture.Length==0))
        //        return BadRequest("Invalid file");
        //    if (!data.Certification.ContentType.StartsWith("image/")|| !data.ProfilePicture.ContentType.StartsWith("image/"))
        //        return BadRequest("Uploaded file is not an image");
        //    await SendEmailToAdmin(data);
        //    CoachRequestDto coachDto = await serviceRequest.AddItemAsync(data);
        //    return Ok(coachDto.Id);
        //    //await service.AddItemAsync(data);

        //    ////חזרה עם הודעה או פעולה נדרשת אחרת
        //    //return Ok();
        //}
        //[HttpPost("AdminPost")] 
        //public async Task<IActionResult> Post(int num,[FromForm] CoachDto data)
        //{
        //    if ((data.Certification == null || data.Certification.Length == 0)
        //        && (data.ProfilePicture == null || data.ProfilePicture.Length == 0))
        //        return BadRequest("Invalid file");
        //    if (!data.Certification.ContentType.StartsWith("image/") || !data.ProfilePicture.ContentType.StartsWith("image/"))
        //        return BadRequest("Uploaded file is not an image");
        //    CoachDto coachDto = await service.AddItemAsync(data);

        //    return Ok(coachDto.Id);
        //}
        [HttpPost("AdminPost/{id}")]
        public async Task<IActionResult> ApproveCoach(int id)
        {
            // 1. שלפי את הבקשה מטבלת הממתינים (CoachRequests)
            var request = await serviceRequest.GetByIdAsync(id); // שליפת הבקשה עם ה-Paths
            if (request == null) return NotFound();

            // המרה ל-CoachDto - ה-Paths עוברים אוטומטית אם השמות זהים
            var coachDto = mapper.Map<CoachDto>(request);

            // קריאה ל-Service (עכשיו הוא לא ינסה להעלות קובץ כי Certification הוא null)
            await service.AddItemAsync(coachDto);

            await serviceRequest.DeleteByIdAsync(id);
            return Ok();
        }
        [HttpGet("{id}")]
        public async Task<CoachResponse?> Get(int id)
        {
            var coach = await service.GetByIdAsync(id);
            var image1 = ImageHelper.GetImageAsync(coach, coach.ProfilePicturePath);
            var image2 = ImageHelper.GetImageAsync(coach, coach.CertificationPath);
            CoachResponse? newcoach = null;
            if (image1 is not NotFoundResult&&image2 is not NotFoundResult)
            {
                newcoach = new CoachResponse
                {
                    Id = coach.Id,
                    FullName = coach.FullName,
                    Email = coach.Email,
                    Password = coach.Password,
                    CertificationPath = coach.CertificationPath,
                    ProfilePicturePath= coach.ProfilePicturePath,
                    Token= coach.Token,
                    CertificationData = (FileContentResult)image2,
                    ProfilePictureData = (FileContentResult)image1,
                };
            }
            return newcoach;
        }
        [HttpPut("{id}")]
        public async Task Put([FromBody] CoachDto value)
        {
            await service.UpdateAsync(value);
        }
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await service.DeleteByIdAsync(id);
        }
       
        private async Task SendEmailToAdmin(CoachRequestDto coach)
        {
            string adminEmail = "yehudit79831@gmail.com";
            string smtpServer = "smtp.gmail.com";
            string emailFrom = "yehudit79831@gmail.com";

            string password = "adna ladh xwnn ovxw";

            MailAddress from = new MailAddress(emailFrom, "מערכת האתר");
            MailAddress to = new MailAddress(adminEmail);

            using (SmtpClient smtpClient = new SmtpClient(smtpServer))
            {
                smtpClient.Port = 587;
                smtpClient.Credentials = new NetworkCredential(emailFrom, password);
                smtpClient.EnableSsl = true;
                smtpClient.UseDefaultCredentials = false; // חשוב להוסיף כדי שישתמש בקרדנשיאלס שנתנו

                using (MailMessage message = new MailMessage(from, to))
                {
                    message.Subject = "New coach registration for approval";
                    message.IsBodyHtml = true;
                    message.Body = $@"
                <div dir='rtl'>
                    <h1>בקשת הצטרפות מורה חדש</h1>
                    <p>שם המורה: {coach.FullName}</p>
                    <p>אימייל: {coach.Email}</p>
                    <br/>
                    <a href='http://localhost:3000/Admin/PendingCoaches' style='padding:10px; background-color:green; color:white; text-decoration:none;'>עבור לעמוד אישור מורים</a>
                </div>";

                    await smtpClient.SendMailAsync(message);
                }
            }
        }
        [HttpPost("ConfirmCoach")]
        public async Task<IActionResult> ConfirmUser([FromBody] CoachDto confirmationRequest)
        {
            if (!IsValidConfirmation(confirmationRequest))
            {
                return BadRequest("Invalid confirmation request");
            }

            // עדכון סטטוס המשתמש לפי האישור
            //var coach = await _userService.GetUserByEmailAsync(confirmationRequest.UserEmail);
            //if (coach == null)
            //{
            //    return NotFound("User not found");
            //}

            //coach.Status = UserStatus.Active;
            //await _userService.UpdateUserAsync(coach);

            return Ok("User confirmed successfully");
        }

        private bool IsValidConfirmation(CoachDto confirmationRequest)
        {
            return true;
        }
        [HttpPost("coacLogIn/{email}/{password}")]

        public CoachResponse Post(string email, string password)
        {
            var coach = Authenticate(email, password);
            if (coach != null)
            {
                var token = Generate(coach);
                coach.Token = token;
                var image1 = ImageHelper.GetImageAsync(coach, coach.CertificationPath);
                var image2 = ImageHelper.GetImageAsync(coach, coach.ProfilePicturePath);
                var userResponse = new CoachResponse
                {
                    Id = coach.Id,
                    FullName = coach.FullName,
                    Email = coach.Email,
                    Password = password,
                    CertificationPath = coach.CertificationPath,
                    ProfilePicturePath = coach.ProfilePicturePath,
                    Token = token,
                    Certification = coach.Certification,
                    ProfilePicture = coach.ProfilePicture,
                    CertificationData =(FileContentResult)image1,
                    ProfilePictureData = (FileContentResult)image2,                   
                };

                return userResponse;
            }
            return null;
        }
        private string Generate(CoachDto user)
        {
            var securitykey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            var credentials = new SigningCredentials(securitykey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
            new Claim(ClaimTypes.Name,user.FullName),
            new Claim(ClaimTypes.Email,user.Email),

            };
            var token = new JwtSecurityToken(config["Jwt:Issuer"], config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private CoachDto Authenticate(string email, string password)
        {
            var CurrentUser = service.GetAllAsync().Result.FirstOrDefault(x => x.Email.ToLower() == email.ToLower()
            && x.Password == password);
            if (CurrentUser != null)
                return CurrentUser;
            return null;
        }
    }
}
