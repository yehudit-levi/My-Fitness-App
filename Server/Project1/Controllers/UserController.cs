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

            UserDto res = await service.AddItemAsync(data);
            return Ok(res);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UserDto value)
        {
            await service.UpdateAsync(value);
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
            public UserResponse UserResponse { get; set; }
        }

        [HttpPost("logIn/{email}/{password}")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var user = Authenticate(email, password);
            if (user != null)
            {
                var token = Generate(user);

                var userResponse = new UserResponse
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    ProfilePicturePath = user.ProfilePicturePath,
                    Token = token,
                    // תיקון: שליפת הנתונים מהקובץ במקום null
                    ProfilePictureData = ImageHelper.GetImageAsync(user, user.ProfilePicturePath) as FileContentResult
                    
                };
                var x = userResponse;

                return Ok(new UserResponseWithToken() { Token = token, UserResponse = userResponse });
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