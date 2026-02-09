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
            Exercise ex = await getByIdAsync(exerciseId);
            //User user = _context.UsersList.FirstOrDefault(x=>x.Id == userId);
            //if(ex != null&&user!=null) 
            //{
            //    if(ex.FavoriteExercises==null)
            //    { 
            //        ex.FavoriteExercises=new HashSet<User>();
            //    }
            //    ex.FavoriteExercises.Add(user);
            //    await _context.Save();
                
            //}
            return ex;
        }

        public async Task deleteFavoritedUserAsync(int userId, int exerciseId)
        {
            //Exercise ex= await getByIdAsync(exerciseId);
            //User user = _context.UsersList.FirstOrDefault(x => x.Id == userId);
            //if (ex != null && user != null)
            //{
            //    ex.FavoriteExercises.Remove(user);
            //    await _context.Save();
            //}
        }

      

        public async Task<List<Exercise>> getAllByIdAsync(int id)
        {
            return await _context.ExercisesList.Where(x => x.CoachId == id).ToListAsync();      
                }
    }
}
