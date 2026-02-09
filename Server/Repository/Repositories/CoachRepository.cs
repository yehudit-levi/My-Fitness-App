using Common;
using Microsoft.EntityFrameworkCore;
using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Repository.Repositories
{
    public class CoachRepository : IRepository<Coach>
    {
        private readonly IContext _context;
        public CoachRepository(IContext context)
        {
            this._context = context;
        }

        public async Task<Coach?> getByIdAsync(int id)
        {           
                return await _context.CoachesList.FirstOrDefaultAsync(x => x.Id == id);           
        }
        public async Task<List<Coach>> getAllAsync()
        {
            return await _context.CoachesList.ToListAsync();
        }

        public async Task<Coach> addAsync(Coach teacher)
        {
            
            //var filePath = teacher.PicturePath;
            //if (!System.IO.File.Exists(filePath))
            //{
            //    //return DllNotFoundException();
            //}
            //var fileBytes = System.IO.File.ReadAllBytes(filePath);
            //var fileExtension = Path.GetExtension(filePath).ToLowerInvariant();
            //var contentType = "image/" + fileExtension[1..];
            var coach = new Coach
            {
                FullName = teacher.FullName,
                Email = teacher.Email,
                Password = teacher.Password,
                ProfilePicturePath = teacher.ProfilePicturePath,
                CertificationPath = teacher.CertificationPath,
                //CertificationData = contentType,
            };
            await _context.CoachesList.AddAsync(coach);
            await _context.Save();
            return coach;
        }

        public async Task updateAsync(Coach teacher)
        {
            _context.CoachesList.Update(teacher);
            await _context.Save();
        }

        public async Task deleteByIdAsync(int id)
        {
            _context.CoachesList.Remove(await getByIdAsync(id));
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

        Task<Coach> IRepository<Coach>.addFavoritedUser(int userId, int exerciseId)
        {
            throw new NotImplementedException();
        }

        public Task deleteFavoritedUserAsync(int userId, int exerciseId)
        {
            throw new NotImplementedException();
        }

        public List<Task<CommentDto>> getAllByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        Task<List<Coach>> IRepository<Coach>.getAllByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
