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
    public class CoachRequestsRepository : IRepository<CoachRequests>
    {
        private readonly IContext _context;
        public CoachRequestsRepository(IContext context)
        {
            this._context = context;
        }

        public async Task<CoachRequests?> getByIdAsync(int id)
        {
            return await _context.CoachRequestsList.FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<List<Coach>> getAllAsync()
        {
            return await _context.CoachesList.ToListAsync();
        }

        public async Task<CoachRequests> addAsync(CoachRequests teacher)
        {

            var coachRequest = new CoachRequests
            {
                FullName = teacher.FullName,
                Email = teacher.Email,
                Password = teacher.Password,
                ProfilePicturePath = teacher.ProfilePicturePath,
                CertificationPath = teacher.CertificationPath,
            };
            
            await _context.CoachRequestsList.AddAsync(coachRequest);
            await _context.Save();
            return coachRequest;
        }

        public async Task updateAsync(Coach teacher)
        {
            _context.CoachesList.Update(teacher);
            await _context.Save();
        }

        public async Task deleteByIdAsync(int id)
        {
            _context.CoachRequestsList.Remove(await getByIdAsync(id));
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

        

        public Task deleteFavoritedUserAsync(int userId, int exerciseId)
        {
            throw new NotImplementedException();
        }

        public List<Task<CommentDto>> getAllByIdAsync(int id)
        {
            throw new NotImplementedException();
        }


        async Task<CoachRequests?> IRepository<CoachRequests>.getByIdAsync(int id)
        {
            return await _context.CoachRequestsList.FirstOrDefaultAsync(x => x.Id == id);
        }

        async Task<List<CoachRequests>> IRepository<CoachRequests>.getAllAsync()
        {
            return await _context.CoachRequestsList.ToListAsync();
        }

        public Task updateAsync(CoachRequests item)
        {
            throw new NotImplementedException();
        }

        Task<CoachRequests> IRepository<CoachRequests>.addFavoritedUser(int userId, int exerciseId)
        {
            throw new NotImplementedException();
        }

        Task<List<CoachRequests>> IRepository<CoachRequests>.getAllByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
