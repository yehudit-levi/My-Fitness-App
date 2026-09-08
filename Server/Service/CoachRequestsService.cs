using AutoMapper;
using Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
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
    public class CoachRequestsService : IService<CoachRequestDto>
    {
        private readonly IRepository<CoachRequests> requestRepository;
        private readonly IMapper mapper;
        private readonly IConfiguration configuration;
        public CoachRequestsService(IRepository<CoachRequests> requestRepository, IMapper mapper, IConfiguration configuration)
        {
            this.requestRepository = requestRepository;
            this.mapper = mapper;
            this.configuration = configuration;
        }

        public async Task<CoachRequestDto> AddItemAsync(CoachRequestDto item)
        {
            if (item.Certification != null && item.Certification.Length > 0)
            {
                // תעודת ההסמכה נשמרת בענן (Cloudinary) ולא על דיסק השרת - CertificationPath מכיל
                // מעכשיו את כתובת ה-URL המלאה, לא נתיב מקומי.
                item.CertificationPath = await CloudinaryHelper.UploadImageAsync(configuration, item.Certification, "coach-certifications");
            }

            CoachRequests request = await requestRepository.addAsync(mapper.Map<CoachRequests>(item));
            return mapper.Map<CoachRequestDto>(request);
        }

        public async Task DeleteByIdAsync(int id)
        {
            await requestRepository.deleteByIdAsync(id);
        }

        public async Task<List<CoachRequestDto>> GetAllAsync()
        {
            var list = await requestRepository.getAllAsync();
            return mapper.Map<List<CoachRequestDto>>(list);
        }

        public async Task<CoachRequestDto> GetByIdAsync(int id)
        {
            var requestEntity = await requestRepository.getByIdAsync(id);
            return mapper.Map<CoachRequestDto>(requestEntity);
        }

        public async Task UpdateAsync(CoachRequestDto item)
        {
            await requestRepository.updateAsync(mapper.Map<CoachRequests>(item));
        }

        public async Task AddFavoriteExercise(AddExerciseRequest requwst)
        {
            await requestRepository.addFavoriteExercise(requwst);
        }

        public Task<CoachRequestDto> AddFavoritedUserAsync(int exerciseId, int userId)
        {
            throw new NotImplementedException();
        }

        public Task DeleteFavoritedUserAsync(int exerciseId, int userId)
        {
            throw new NotImplementedException();
        }

        public Task<List<CoachRequestDto>> GetFavoriteExercisesAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<List<CoachRequestDto>> GetAllByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<CoachRequestDto>> GetAllByCoachIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
