using AutoMapper;
using Common;
using Microsoft.AspNetCore.Http;
using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class UserService : IService<UserDto>
    {
        private readonly IRepository<User> userRepository;
        //private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public UserService(IRepository<User> userRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
        }
        public async Task<UserDto> AddItemAsync(UserDto item)
        {           
            if (item.ProfilePicture == null || item.ProfilePicture.FileName == null || item.ProfilePicture.FileName.Length == 0)
            {
               // return null;
                int num = 0;
                
            }
            var  path = await UploadImageAsync(item.ProfilePicture);
            item.ProfilePicturePath = path;

          User user=  await userRepository.addAsync(mapper.Map<User>(item));
            return mapper.Map<UserDto>(user);
        }
        private static async Task<string> UploadImageAsync(IFormFile image)
        {
            string path = Path.Combine(Environment.CurrentDirectory, "Images/", image.FileName);
            using (FileStream stream = new(path, FileMode.Create))
            {
                await image.CopyToAsync(stream);
                stream.Close();
            }
            return path;
        }
        public async Task DeleteByIdAsync(int id)
        {
            await userRepository.deleteByIdAsync(id);
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
            return await mapper.Map<Task<List<UserDto>>>(userRepository.getAllAsync());
        }

        public async Task<UserDto> GetByIdAsync(int id)
        {
            return await mapper.Map<Task<UserDto>>(userRepository.getByIdAsync(id));
        }


        public async Task UpdateAsync(UserDto item)
        {
            await userRepository.updateAsync(mapper.Map<User>(item));
        }
        public async Task AddFavoriteExercise(AddExerciseRequest requwst)
        {
            await userRepository.addFavoriteExercise(requwst);
        }

        public Task<UserDto> AddFavoritedUserAsync(int exerciseId, int userId)
        {
            throw new NotImplementedException();
        }

        public Task DeleteFavoritedUserAsync(int exerciseId, int userId)
        {
            throw new NotImplementedException();
        }

       

        Task<List<UserDto>> IService<UserDto>.GetAllByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<UserDto>> GetAllByCoachIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
