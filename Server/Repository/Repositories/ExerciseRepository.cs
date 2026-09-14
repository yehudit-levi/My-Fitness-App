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
                Min = Exercise.Min,
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
            // FavoriteExercises הוא כיום קשר many-to-many אמיתי בין User ל-Exercise (ר' ההערה
            // המפורטת ב-MyDataContext.cs) - לא שדה-צל בודד כמו שהיה פעם בגרסה ישנה יותר של המודל.
            // הקוד הישן כאן ניסה לגשת ל-"ExerciseId" כשדה-צל ישיר על User דרך Entry(...).Property(...),
            // אבל שדה כזה כבר לא קיים במודל הנוכחי (הוחלף בטבלת קישור אמיתית) - זה בדיוק מה שגרם
            // לשגיאת 500 בעת לחיצה על "הוספה למועדפים": EF Core זרק חריגה כי לא מצא שדה-צל כזה.
            // התיקון: לטעון את האוסף הקיים (Include) ולהוסיף אליו כמו ב-UserRepository.addFavoriteExercise.
            Exercise ex = await getByIdAsync(exerciseId);
            User user = await _context.UsersList.Include(u => u.FavoriteExercises).FirstOrDefaultAsync(x => x.Id == userId);
            if (ex != null && user != null && !user.FavoriteExercises.Any(f => f.Id == ex.Id))
            {
                user.FavoriteExercises.Add(ex);
                await _context.Save();
            }
            return ex;
        }

        public async Task deleteFavoritedUserAsync(int userId, int exerciseId)
        {
            User user = await _context.UsersList.Include(u => u.FavoriteExercises).FirstOrDefaultAsync(x => x.Id == userId);
            if (user != null)
            {
                var favorite = user.FavoriteExercises.FirstOrDefault(f => f.Id == exerciseId);
                if (favorite != null)
                {
                    user.FavoriteExercises.Remove(favorite);
                    await _context.Save();
                }
            }
        }

        // בניגוד למה שחשבתי קודם - זו כן מתודה שנקראת בפועל עבור Exercise: האזור האישי
        // (personalZone.tsx) קורא לה כדי להציג את "רשימת המועדפים" של המשתמש המחובר
        // (GET /Exercise/favorites/{userId}). הקריאה הקודמת כאן זרקה NotImplementedException,
        // ולכן הרשימה תמיד נכשלה בשקט (ה-catch בצד הלקוח רק כותב ל-console, בלי הודעת שגיאה
        // גלויה) והוצגה כרשימה ריקה למרות שההוספה עצמה הצליחה.
        public async Task<List<Exercise>> getFavoriteExercisesAsync(int userId)
        {
            User user = await _context.UsersList.Include(u => u.FavoriteExercises).FirstOrDefaultAsync(x => x.Id == userId);
            return user?.FavoriteExercises?.ToList() ?? new List<Exercise>();
        }

      

        public async Task<List<Exercise>> getAllByIdAsync(int id)
        {
            return await _context.ExercisesList.Where(x => x.CoachId == id).ToListAsync();      
                }
    }
}
