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

        public async Task<List<CoachRequests>> getAllAsync()
        {
            return await _context.CoachRequestsList.ToListAsync();
        }

        public async Task<CoachRequests> addAsync(CoachRequests item)
        {
            var coachRequest = new CoachRequests
            {
                UserId = item.UserId,
                CertificationPath = item.CertificationPath,
            };

            await _context.CoachRequestsList.AddAsync(coachRequest);
            await _context.Save();
            return coachRequest;
        }

        public async Task updateAsync(CoachRequests item)
        {
            _context.CoachRequestsList.Update(item);
            await _context.Save();
        }

        public async Task deleteByIdAsync(int id)
        {
            var existing = await getByIdAsync(id);
            if (existing != null)
            {
                _context.CoachRequestsList.Remove(existing);
                await _context.Save();
            }
        }

        public Task addFavoriteExercise(AddExerciseRequest requwst)
        {
            throw new NotImplementedException();
        }

        public Task<CoachRequests> addFavoritedUser(int userId, int exerciseId)
        {
            throw new NotImplementedException();
        }

        public Task deleteFavoritedUserAsync(int userId, int exerciseId)
        {
            throw new NotImplementedException();
        }

        public Task<List<CoachRequests>> getFavoriteExercisesAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<List<CoachRequests>> getAllByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
