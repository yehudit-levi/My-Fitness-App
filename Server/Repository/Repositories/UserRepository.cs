using Common;
using Microsoft.EntityFrameworkCore;
using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class UserRepository : IRepository<User>
    {
        private readonly IContext _context;
        public UserRepository(IContext context)
        {
            this._context = context;
        }

        public async Task<User?> getByIdAsync(int id)
        {
            return await _context.UsersList.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<User>> getAllAsync()
        {
            return await _context.UsersList.ToListAsync();
        }

        public async Task<User> addAsync(User item)
        {
            var user = new User
            {
                Username = item.Username,
                Min = item.Min,
                Email = item.Email,
                Password = item.Password,
                ProfilePicturePath = item.ProfilePicturePath,
            };           
            await _context.UsersList.AddAsync(user);
            await _context.Save();
            return user;
        }

        public async Task updateAsync(User user)
        {
            // אם כבר קיים מופע (instance) אחר של אותו משתמש שכבר במעקב (tracked) ב-DbContext הנוכחי -
            // למשל כי קודם באותה בקשה נשלף המשתמש עם getByIdAsync (כמו ב"עדכון בטוח" של פרופיל,
            // או באישור בקשת מאמן) - חייבים "לשחרר" (detach) אותו לפני שמצרפים את המופע החדש עם
            // אותו Id, אחרת EF Core זורק שגיאה כי הוא לא יכול לעקוב אחרי שני מופעים שונים עם אותו מפתח.
            var tracked = _context.UsersList.Local.FirstOrDefault(u => u.Id == user.Id);
            if (tracked != null)
            {
                _context.UsersList.Attach(tracked).State = EntityState.Detached;
            }

            _context.UsersList.Update(user);
            await _context.Save();
        }

        public async Task deleteByIdAsync(int id)
        {
            _context.UsersList.Remove(await getByIdAsync(id));
            await _context.Save();
        }

        public async Task addFavoriteExercise(AddExerciseRequest requwst)
        {

            //User currentUser = await _context.UsersList.FirstOrDefaultAsync(x => x.Id == requwst.IdUser);
            //if (currentUser != null)
            //{
            //    foreach (var item in requwst.IdExercises)
            //    {
            //        Exercise ex = await _context.ExercisesList.FirstOrDefaultAsync(x => x.Id == item);
            //        if (ex != null)
            //            currentUser.FavoriteExercises.Add(ex);
            //    }
            //    await _context.Save();
            //}
            throw new NotImplementedException();

        }

        public Task addFavoritedUser(int userId, int exerciseId)
        {
            throw new NotImplementedException();
        }

        Task<User> IRepository<User>.addFavoritedUser(int userId, int exerciseId)
        {
            throw new NotImplementedException();
        }

        public Task deleteFavoritedUserAsync(int userId, int exerciseId)
        {
            throw new NotImplementedException();
        }

        public Task<List<User>> getFavoriteExercisesAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<List<User>> getAllByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        //public  async Task AddFavoriteExercise(int idUser,List<int> idExecises)
        //{
        //    User currentUser =await _context.UsersList.FirstOrDefaultAsync(x => x.Id == idUser);
        //    foreach (var item in idExecises)
        //    {
        //        Exercise ex =await _context.ExercisesList.FirstOrDefaultAsync(x => x.Id == item);
        //        currentUser.FavoriteExercises.Add(ex);
        //    }
        //   await _context.Save();
        //}


    }
    }
