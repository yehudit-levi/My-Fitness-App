using AutoMapper;
using Common;
using Microsoft.AspNetCore.Http;
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
        public CoachRequestsService(IRepository<CoachRequests> requestRepository, IMapper mapper)
        {
            this.requestRepository = requestRepository;
            this.mapper = mapper;
        }

        public async Task<CoachRequestDto> AddItemAsync(CoachRequestDto item)
        {
            if (item.Certification != null && item.Certification.Length > 0)
            {
                item.CertificationPath = await UploadImageAsync(item.Certification);
            }

            CoachRequests request = await requestRepository.addAsync(mapper.Map<CoachRequests>(item));
            return mapper.Map<CoachRequestDto>(request);
        }

        private static async Task<string> UploadImageAsync(IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                throw new ArgumentException("No image provided or image is empty.");
            }

            // בדיקת סוג הקובץ
            string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif" };
            string extension = Path.GetExtension(image.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                throw new ArgumentException("Invalid image file type.");
            }

            // נתיב השמירה - יחסי לתיקיית ההרצה של השרת, אותה תיקייה שממנה Program.cs מגיש את התמונות
            string directoryPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Images");

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            string filePath = Path.Combine(directoryPath, image.FileName);

            using (FileStream stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            return filePath;
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
