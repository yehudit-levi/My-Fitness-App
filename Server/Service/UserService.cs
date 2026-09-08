using AutoMapper;
using Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
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
        private readonly IConfiguration configuration;

        public UserService(IRepository<User> userRepository, IMapper mapper, IConfiguration configuration)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
            this.configuration = configuration;
        }
        public async Task<UserDto> AddItemAsync(UserDto item)
        {           
            if (item.ProfilePicture == null || item.ProfilePicture.FileName == null || item.ProfilePicture.FileName.Length == 0)
            {
               // return null;
                int num = 0;
                
            }
            // תמונת הפרופיל נשמרת בענן (Cloudinary) ולא על דיסק השרת - ProfilePicturePath מכיל
            // מעכשיו את כתובת ה-URL המלאה של התמונה, לא נתיב מקומי.
            var path = await CloudinaryHelper.UploadImageAsync(configuration, item.ProfilePicture, "profile-pictures");
            item.ProfilePicturePath = path;

          User user=  await userRepository.addAsync(mapper.Map<User>(item));
            return mapper.Map<UserDto>(user);
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

        public Task<List<UserDto>> GetFavoriteExercisesAsync(int userId)
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
