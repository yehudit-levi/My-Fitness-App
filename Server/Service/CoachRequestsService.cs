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
    public class CoachRequestsService : IService<CoachRequestDto>
    {
        private readonly IRepository<CoachRequests> teacherRequestsRepository;
        private readonly IMapper mapper;
        public CoachRequestsService(IRepository<CoachRequests> teacherRequestsRepository, IMapper mapper)
        {
            this.teacherRequestsRepository = teacherRequestsRepository;
            this.mapper = mapper;
        }

        public async Task<CoachRequestDto> AddItemAsync(CoachRequestDto item)
        {
            if (item.ProfilePicture == null || item.ProfilePicture.FileName == null || item.ProfilePicture.FileName.Length == 0)
            {
                //return null;
                int num = 0;

            }

            var path = await UploadImageAsync(item.ProfilePicture);
            item.ProfilePicturePath = path;
            path = await UploadImageAsync(item.Certification);
            item.CertificationPath = path;
            CoachRequests c = new CoachRequests()
            {
                Id = item.Id,
                FullName = item.FullName,
                Email = item.Email,
                Password = item.Password,
                CertificationPath = item.CertificationPath,
                ProfilePicturePath = item.ProfilePicturePath,
                Token = item.Token,
            };
            //await teacherRepository.addAsync(c);
            CoachRequests coach = await teacherRequestsRepository.addAsync(mapper.Map<CoachRequests>(item));
            return mapper.Map<CoachRequestDto>(coach);
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
            await teacherRequestsRepository.deleteByIdAsync(id);
        }

        public async Task<List<CoachRequestDto>> GetAllAsync()
        {
            return await mapper.Map<Task<List<CoachRequestDto>>>(teacherRequestsRepository.getAllAsync());
        }

        public async Task<CoachRequestDto> GetByIdAsync(int id)
        {
            // 1. מחכים לקבלת הישות (Entity) ממסד הנתונים
            var coachRequestEntity = await teacherRequestsRepository.getByIdAsync(id);

            // 2. מבצעים את המיפוי על הישות שהתקבלה ולא על ה-Task
            return mapper.Map<CoachRequestDto>(coachRequestEntity);
        }
        //public async Task<CoachRequests> GetAllByCoachIdAsync(int id)
        //{
        //    // 1. מחכים לקבלת הישות (Entity) ממסד הנתונים
        //    return await teacherRequestsRepository.getByIdAsync(id);

        //    // 2. מבצעים את המיפוי על הישות שהתקבלה ולא על ה-Task

        //}

        public async Task UpdateAsync(CoachRequestDto item)
        {
            await teacherRequestsRepository.updateAsync(mapper.Map<CoachRequests>(item));
        }
        public async Task AddFavoriteExercise(AddExerciseRequest requwst)
        {
            await teacherRequestsRepository.addFavoriteExercise(requwst);
        }

        public Task<CoachRequestDto> AddFavoritedUserAsync(int exerciseId, int userId)
        {
            throw new NotImplementedException();
        }

        public Task DeleteFavoritedUserAsync(int exerciseId, int userId)
        {
            throw new NotImplementedException();
        }

        public Task<List<CoachRequestDto>> GetAllByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

      public  Task<CoachRequests> GetByIdAsync2(int id)
        {
            throw new NotImplementedException();
        }

        Task<List<CoachRequestDto>> IService<CoachRequestDto>.GetAllByCoachIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
