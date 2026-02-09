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
    public class CommentService : IService<CommentDto>
    {
        private readonly IRepository<Comment> fidbekRepository;
        private readonly IMapper mapper;

        public CommentService(IRepository<Comment> fidbekRepository, IMapper mapper)
        {
            this.fidbekRepository = fidbekRepository;
            this.mapper = mapper;
        }

        public Task AddFavoriteExercise(int idUser, List<int> idExecises)
        {
            throw new NotImplementedException();
        }

        public async Task<CommentDto> AddItemAsync(CommentDto item)
        {
           Comment comment= await fidbekRepository.addAsync(mapper.Map<Comment>(item));
            return mapper.Map<CommentDto>(comment);
        }

        public async Task DeleteByIdAsync(int id)
        {
            await fidbekRepository.deleteByIdAsync(id);
        }

        public async Task<List<CommentDto>> GetAllAsync()
        {
            return await mapper.Map<Task<List<CommentDto>>>(fidbekRepository.getAllAsync());
        }

        public async Task<CommentDto> GetByIdAsync(int id)
        {
            return await mapper.Map<Task<CommentDto>>(fidbekRepository.getByIdAsync(id));
        }


        public async Task UpdateAsync(CommentDto item)
        {
            await fidbekRepository.updateAsync(mapper.Map<Comment>(item));
        }
        public async Task AddFavoriteExercise(AddExerciseRequest requwst)
        {
            await fidbekRepository.addFavoriteExercise(requwst);
        }

        public Task<CommentDto> AddFavoritedUserAsync(int exerciseId, int userId)
        {
            throw new NotImplementedException();
        }

        public Task DeleteFavoritedUserAsync(int exerciseId, int userId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<CommentDto>> GetAllByIdAsync(int id)
        {
            return await mapper.Map<Task<List<CommentDto>>>(fidbekRepository.getAllByIdAsync(id));
        }

        public Task<List<CommentDto>> GetAllByCoachIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
