using Common;
using Microsoft.EntityFrameworkCore;
using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class ExerciseRepository : IRepository<Exercise>
    {
        private readonly IContext _context;
        public ExerciseRepository(IContext context)
        {
            this._context = context;
        }

        public async Task<Exercise?> getByIdAsync(int id)
        {

            return await _context.ExercisesList.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Exercise>> getAllAsync()
        {
            return await _context.ExercisesList.ToListAsync();
        }

        public async Task<Exercise> addAsync(Exercise Exercise)
        {
            var ex = new Exercise
            {
                Description = Exercise.Description,
                ImageOrVideo = Exercise.ImageOrVideo,
                Category = Exercise.Category,
                Difficulty = Exercise.Difficulty,
                PublishDate = DateTime.Now,
                CoachId = Exercise.CoachId,
            };
            await _context.ExercisesList.AddAsync(ex);
            await _context.Save();
            return ex;
        }

        public async Task updateAsync(Exercise Exercise)
        {
            _context.ExercisesList.Update(Exercise);
            await _context.Save();
        }

        public async Task deleteByIdAsync(int id)
        {
            _context.ExercisesList.Remove(await getByIdAsync(id));
            await _context.Save();
        }

        public Task addFavoriteExercise(AddExerciseRequest request)
        {
            throw new NotImplementedException();
        }

        public async Task<Exercise> addFavoritedUser(int userId, int exerciseId)
        {
            // תיקון: קודם זה היה שדה-צל יחיד (מועדף אחד בלבד לכל משתמש, שלחיצה חדשה
            // פשוט דרסה). עכשיו זה יחס many-to-many אמיתי (דרך Exercise.FavoriteExercises /
            // User.FavoriteExercises) - כך שאפשר לצבור רשימה שלמה של מועדפים לכל משתמש.
            Exercise ex = await _context.ExercisesList
                .Include(e => e.FavoriteExercises)
                .FirstOrDefaultAsync(x => x.Id == exerciseId);
            User user = await _context.UsersList.FirstOrDefaultAsync(x => x.Id == userId);
            if (ex != null && user != null)
            {
                if (!ex.FavoriteExercises.Any(u => u.Id == userId))
                {
                    ex.FavoriteExercises.Add(user);
                    await _context.Save();
                }
            }
            return ex;
        }

        public async Task deleteFavoritedUserAsync(int userId, int exerciseId)
        {
            Exercise ex = await _context.ExercisesList
                .Include(e => e.FavoriteExercises)
                .FirstOrDefaultAsync(x => x.Id == exerciseId);
            if (ex != null)
            {
                var favoriteUser = ex.FavoriteExercises.FirstOrDefault(u => u.Id == userId);
                if (favoriteUser != null)
                {
                    ex.FavoriteExercises.Remove(favoriteUser);
                    await _context.Save();
                }
            }
        }

        // כל התרגילים שהמשתמש הנתון סימן כמועדפים (לרשימת "המועדפים שלי" באזור האישי).
        public async Task<List<Exercise>> getFavoriteExercisesAsync(int userId)
        {
            return await _context.ExercisesList
                .Where(e => e.FavoriteExercises.Any(u => u.Id == userId))
                .OrderByDescending(e => e.PublishDate)
                .ToListAsync();
        }

        public async Task<List<Exercise>> getAllByIdAsync(int id)
        {
            return await _context.ExercisesList.Where(x => x.CoachId == id).ToListAsync();      
                }
    }
}
