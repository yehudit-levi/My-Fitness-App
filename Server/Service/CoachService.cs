using AutoMapper;
using Common;
using DocumentFormat.OpenXml.Vml.Office;
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
    public class CoachService : IService<CoachDto>
    {
        private readonly IRepository<Coach> teacherRepository;
        private readonly IMapper mapper;
        public CoachService(IRepository<Coach> teacherRepository, IMapper mapper)
        {
            this.teacherRepository = teacherRepository;
            this.mapper = mapper;
        }

        public Task AddFavoriteExercise(int idUser, List<int> idExecises)
        {
            throw new NotImplementedException();
        }

        public async Task<CoachDto> AddItemAsync(CoachDto item)
        {
            if (item.ProfilePicture != null && item.ProfilePicture.Length > 0)
            {
                item.ProfilePicturePath = await UploadImageAsync(item.ProfilePicture);
            }

            if (item.Certification != null && item.Certification.Length > 0)
            {
                item.CertificationPath = await UploadImageAsync(item.Certification);
            }

            Coach coach = await teacherRepository.addAsync(mapper.Map<Coach>(item));

            return mapper.Map<CoachDto>(coach);
        }
        private static async Task<string> UploadImageAsync(IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                throw new ArgumentException("No image provided or image is empty.");
            }

            // בדיקת סוג הקובץ
            string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
            string extension = Path.GetExtension(image.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                throw new ArgumentException("Invalid image file type.");
            }

            // נתיב השמירה בנתיב קבוע
            string directoryPath = @"C:\Images\";

            // יצירת תיקייה אם היא לא קיימת
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            // שם הקובץ כולל הנתיב
            string filePath = Path.Combine(directoryPath, image.FileName);

            // שמירת הקובץ
            using (FileStream stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            return filePath;
        }

        //private static async Task<string> UploadImageAsync(IFormFile image)
        //{
        //    string path = Path.Combine(Environment.CurrentDirectory, "Images/", image.FileName);
        //    using (FileStream stream = new(path, FileMode.Create))
        //    {
        //        await image.CopyToAsync(stream);
        //        stream.Close();
        //    }
        //    return path;
        //}


        public async Task DeleteByIdAsync(int id)
        {
            await teacherRepository.deleteByIdAsync(id);
        }

        public async Task<List<CoachDto>> GetAllAsync()
        {
            return await mapper.Map<Task<List<CoachDto>>>(teacherRepository.getAllAsync());
        }

        public async Task<CoachDto> GetByIdAsync(int id)
        {
            return await mapper.Map<Task<CoachDto>>(teacherRepository.getByIdAsync(id));
        }

        public async Task UpdateAsync(CoachDto item)
        {
            await teacherRepository.updateAsync(mapper.Map<Coach>(item));
        }
        public async Task AddFavoriteExercise(AddExerciseRequest requwst)
        {
            await teacherRepository.addFavoriteExercise(requwst);
        }

        public Task<CoachDto> AddFavoritedUserAsync(int exerciseId, int userId)
        {
            throw new NotImplementedException();
        }

        public Task DeleteFavoritedUserAsync(int exerciseId, int userId)
        {
            throw new NotImplementedException();
        }

       

        Task<List<CoachDto>> IService<CoachDto>.GetAllByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<CoachDto>> GetAllByCoachIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
