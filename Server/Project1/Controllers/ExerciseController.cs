using AutoMapper;
using Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.Entity;
using Repository.Repositories;
using Service;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExerciseController : ControllerBase
    {
        private readonly IService<ExerciseDto> exerciseService;
        private readonly IService<CommentDto> commentService;

        public ExerciseController(IService<ExerciseDto> exerciseService, IService<CommentDto> commentService)
        {
            this.exerciseService = exerciseService;
            this.commentService = commentService;
        }

        // GET: api/Exercise
        [HttpGet]
        public async Task<List<MiniExerciseResponse>> GetAll()
        {
            var exercises = await exerciseService.GetAllAsync();
            return exercises.Select(i => new MiniExerciseResponse
            {
                Id = i.Id,
                Description = i.Description,
                Min = i.Min,
                ImageOrVideo = i.ImageOrVideo,
                Category = i.Category,
                Difficulty = i.Difficulty,
                CoachId = i.CoachId,
            }).ToList();
        }

        // GET: api/Exercise/byCoach/5/10
        [HttpGet("byCoach/{id}/{num}")]
        public async Task<List<ExerciseResponse>> GetByCoach(int id, int num)
        {
            // שליפה מהשירות
            var exercises = await exerciseService.GetAllByCoachIdAsync(id);

            var displayImages = exercises.Select(i => {
                // המרה בטוחה יותר כדי למנוע null מפתיע
                var fileResult = ImageHelper.GetFileAsync(i, i.ImageOrVideo);

                return new ExerciseResponse
                {
                    Id = i.Id,
                    Description = i.Description,
                    Min = i.Min,
                    ImageOrVideo = i.ImageOrVideo,
                    Category = i.Category,
                    Difficulty = i.Difficulty,
                    PublishDate = i.PublishDate,
                    VideoUrl = null,
                    // הצבה רק אם הקובץ באמת קיים
                    VideoData = fileResult as FileContentResult
                };
            }).OrderByDescending(e => e.PublishDate).ToList();

            return displayImages;
        }

        // GET: api/Exercise/Last
        [HttpGet("Last")]
        public async Task<List<ExerciseResponse>> GetLast(double num)
        {
            var exercises = await exerciseService.GetAllAsync();
            var displayImages = exercises.Select(i => new ExerciseResponse
            {
                Id = i.Id,
                Description = i.Description,
                Min = i.Min,
                ImageOrVideo = i.ImageOrVideo,
                Category = i.Category,
                Difficulty = i.Difficulty,
                PublishDate = i.PublishDate,
                VideoUrl = null,
                // טיפול ב-Casting בטוח
                VideoData = ImageHelper.GetFileAsync(i, i.ImageOrVideo) as FileContentResult,
            }).ToList();

            return displayImages.OrderByDescending(e => e.PublishDate).Take(3).ToList();
        }

        [HttpGet("videos/{videoName}")]
        public IActionResult GetVideo(string videoName)
        {
            try
            {
                var videoPath = ImageHelper.GetVideo(videoName);
                return PhysicalFile(videoPath, "video/mp4");
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // GET api/Exercise/5
        [HttpGet("{id:int}")]
        public async Task<ExerciseResponse> GetById(int id)
        {
            var exercise = await exerciseService.GetByIdAsync(id);
            if (exercise == null) return null;

            return new ExerciseResponse
            {
                Id = exercise.Id,
                Description = exercise.Description,
                Min = exercise.Min,
                ImageOrVideo = exercise.ImageOrVideo,
                Category = exercise.Category,
                Difficulty = exercise.Difficulty,
                PublishDate = exercise.PublishDate,
                VideoData = ImageHelper.GetFileAsync(exercise, exercise.ImageOrVideo) as FileContentResult,
                Comments = await commentService.GetAllByIdAsync(id),
            };
        }

        [HttpGet("Gender/{min}")]
        public async Task<List<MiniExerciseResponse>> GetByGender(string min)
        {
            var exercises = await exerciseService.GetAllAsync();
            return exercises.Where(i => i.Min == min).Select(i => new MiniExerciseResponse
            {
                Id = i.Id,
                Description = i.Description,
                Min = i.Min,
                Category = i.Category,
                Difficulty = i.Difficulty,
            }).ToList();
        }

        [HttpGet("Difficulty/{difficulty}")]
        public async Task<List<MiniExerciseResponse>> GetByDifficulty(string difficulty)
        {
            var exercises = await exerciseService.GetAllAsync();
            return exercises.Where(i => i.Difficulty == difficulty).Select(i => new MiniExerciseResponse
            {
                Id = i.Id,
                Description = i.Description,
                Min = i.Min,
                Category = i.Category,
                Difficulty = i.Difficulty,
            }).ToList();
        }

        [HttpGet("Category/{category}")]
        public async Task<List<MiniExerciseResponse>> GetByCategory(string category)
        {
            var exercises = await exerciseService.GetAllAsync();
            return exercises.Where(i => i.Category == category).Select(i => new MiniExerciseResponse
            {
                Id = i.Id,
                Description = i.Description,
                Min = i.Min,
                Category = i.Category,
                Difficulty = i.Difficulty,
            }).ToList();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] ExerciseDto value)
        {
            if (value.VideoUrl != null && value.VideoUrl.Length > 0)
            {
                var filePath = Path.Combine("uploads", Guid.NewGuid().ToString() + Path.GetExtension(value.VideoUrl.FileName));
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await value.VideoUrl.CopyToAsync(stream);
                }
                value.ImageOrVideo = filePath;
            }
            value.PublishDate = DateTime.Now;
            var exercise = await exerciseService.AddItemAsync(value);
            return CreatedAtAction(nameof(GetById), new { id = exercise.Id }, exercise);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateExercise(int id, [FromBody] ExerciseDto value)
        {
            if (id != value.Id) return BadRequest();
            await exerciseService.UpdateAsync(value);
            return NoContent();
        }

        // מסמן תרגיל כמועדף עבור משתמש נתון
        [HttpPost("{exerciseId}/favorite/{userId}")]
        public async Task<IActionResult> AddFavorite(int exerciseId, int userId)
        {
            var exercise = await exerciseService.AddFavoritedUserAsync(exerciseId, userId);
            if (exercise == null) return NotFound();
            return Ok();
        }

        // מסיר תרגיל מהמועדפים של משתמש נתון
        [HttpDelete("{exerciseId}/favorite/{userId}")]
        public async Task<IActionResult> RemoveFavorite(int exerciseId, int userId)
        {
            await exerciseService.DeleteFavoritedUserAsync(exerciseId, userId);
            return Ok();
        }

        // רשימת כל התרגילים שמשתמש נתון סימן כמועדפים - לתצוגה באזור האישי
        [HttpGet("favorites/{userId}")]
        public async Task<List<MiniExerciseResponse>> GetFavorites(int userId)
        {
            var exercises = await exerciseService.GetFavoriteExercisesAsync(userId);
            return exercises.Select(i => new MiniExerciseResponse
            {
                Id = i.Id,
                Description = i.Description,
                Min = i.Min,
                ImageOrVideo = i.ImageOrVideo,
                Category = i.Category,
                Difficulty = i.Difficulty,
                CoachId = i.CoachId,
            }).ToList();
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await exerciseService.DeleteByIdAsync(id);
        }
    }
}