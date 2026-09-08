using AutoMapper;
using Common;
using Repository.Entity;
using Repository.Interfaces;
using Repository.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class ExerciseService : IService<ExerciseDto>
    {
        private readonly IRepository<Exercise> exerciseRepository;
        private readonly IMapper mapper;

        public ExerciseService(IRepository<Exercise> exerciseRepository, IMapper mapper)
        {
            this.exerciseRepository = exerciseRepository;
            this.mapper = mapper;
        }

        public Task AddFavoriteExercise(int idUser, List<int> idExecises)
        {
            throw new NotImplementedException();
        }

        public async Task<ExerciseDto> AddItemAsync(ExerciseDto item)
        {
          Exercise exercise=  await exerciseRepository.addAsync(mapper.Map<Exercise>(item));
            return mapper.Map<ExerciseDto>(exercise);
        }

        public async Task DeleteByIdAsync(int id)
        {
            await exerciseRepository.deleteByIdAsync(id);
        }

        public async Task<List<ExerciseDto>> GetAllAsync()
        {
            return await mapper.Map<Task<List<ExerciseDto>>>(exerciseRepository.getAllAsync());
        }

        public async Task<ExerciseDto> GetByIdAsync(int id)
        {
            return await mapper.Map<Task<ExerciseDto>>(exerciseRepository.getByIdAsync(id));
        }


        public async Task UpdateAsync(ExerciseDto item)
        {
            await exerciseRepository.updateAsync(mapper.Map<Exercise>(item));
        }
        public async Task AddFavoriteExercise(AddExerciseRequest requwst)
        {
            await exerciseRepository.addFavoriteExercise(requwst);
        }

        public async Task<ExerciseDto> GetByEmailAsync(string? coachEmail)
        {
            throw new NotImplementedException();
        }

        public async  Task<ExerciseDto> AddFavoritedUserAsync(int exerciseId, int userId)
        {
           return await mapper.Map<Task<ExerciseDto>>(exerciseRepository.addFavoritedUser(userId, exerciseId));
        }
        public async Task DeleteFavoritedUserAsync(int exerciseId, int userId)
        {
            await exerciseRepository.deleteFavoritedUserAsync(userId, exerciseId);
        }

        public async Task<List<ExerciseDto>> GetFavoriteExercisesAsync(int userId)
        {
            return await mapper.Map<Task<List<ExerciseDto>>>(exerciseRepository.getFavoriteExercisesAsync(userId));
        }

       

        Task<List<ExerciseDto>> IService<ExerciseDto>.GetAllByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<ExerciseDto>> GetAllByCoachIdAsync(int id)
        {
           return await mapper.Map<Task<List<ExerciseDto>>>(exerciseRepository.getAllByIdAsync(id));
        }
    }
}
