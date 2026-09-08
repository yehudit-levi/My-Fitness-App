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
    public class CommentRepository : IRepository<Comment>
    {
        private readonly IContext _context;
        public CommentRepository(IContext context)
        {
            this._context = context;
        }

        public async Task<Comment?> getByIdAsync(int id)
        {
            return await _context.CommentsList.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Comment>> getAllAsync()
        {
            return await _context.CommentsList.ToListAsync();
        }

        public async Task<Comment> addAsync(Comment Comment)
        {
            //User user = await _context.UsersList.FirstOrDefaultAsync(X => X.Id == Comment.UserId);
            //Exercise ex = await _context.ExercisesList.FirstOrDefaultAsync(X => X.Id == Comment.ExerciseId);
            //if (user != null && ex != null)
            //{
            //    await _context.CommentsList.AddAsync(Comment);
            //    user.CommentsOnExercises.Add(Comment);
            //    await _context.Save();
            //}
            //else
            //    Console.WriteLine("No such user or exercise found!");
           await _context.CommentsList.AddAsync(Comment);
            await _context.Save();

            return Comment;
        }

        public async Task updateAsync(Comment Comment)
        {
            _context.CommentsList.Update(Comment);
            await _context.Save();
        }

        public async Task deleteByIdAsync(int id)
        {
            _context.CommentsList.Remove(await getByIdAsync(id));
            await _context.Save();
        }

        public Task addFavoriteExercise(AddExerciseRequest requwst)
        {
            throw new NotImplementedException();
        }

        public Task addFavoritedUser(int userId, int exerciseId)
        {
            throw new NotImplementedException();
        }

        Task<Comment> IRepository<Comment>.addFavoritedUser(int userId, int exerciseId)
        {
            throw new NotImplementedException();
        }

        public Task deleteFavoritedUserAsync(int userId, int exerciseId)
        {
            throw new NotImplementedException();
        }

        public Task<List<Comment>> getFavoriteExercisesAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public async  Task<List<Comment>> getAllByIdAsync(int id)
        {
            return await _context.CommentsList
                .Where(comment => comment.ExerciseId == id).ToListAsync(); // בודק אם המזהה של התגובה שווה למזהה שהתקבל
                 // לסיים בכך שמפרטים לשרת שנרצה את התוצאה כרשימה
        }

       
    }
}
