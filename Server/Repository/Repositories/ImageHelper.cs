using System.IO;
using Common;
using Microsoft.AspNetCore.Mvc;
using Repository.Entity;

namespace Repository.Repositories
{
    public static class ImageHelper
    {
        public static IActionResult GetImageAsync(object dto, string path)
        {
            if (string.IsNullOrEmpty(path))
                return new NotFoundResult();

            // בדיקה אם הקובץ קיים בנתיב המוחלט או היחסי
            if (!File.Exists(path))
            {
                // אם הקובץ לא נמצא, ננסה לחפש אותו בתיקיית ה-Images שלך ב-:D
                var alternativePath = Path.Combine(@"D:\PROJECT\Project1\Project1\Images", Path.GetFileName(path));
                if (File.Exists(alternativePath))
                    path = alternativePath;
                else
                    return new NotFoundResult();
            }

            var fileBytes = File.ReadAllBytes(path);
            var fileExtension = Path.GetExtension(path).ToLowerInvariant();

            // טיפול ב-ContentType (הורדת הנקודה מהסיומת)
            var contentType = fileExtension == ".jpg" || fileExtension == ".jpeg"
                              ? "image/jpeg"
                              : "image/" + fileExtension.TrimStart('.');

            return new FileContentResult(fileBytes, contentType);
        }
        public static IActionResult GetFileAsync(object dto, string path)
        {
            if (dto == null)
                return new NotFoundResult();

            if (string.IsNullOrEmpty(path))
                return new NotFoundResult();

            if (!File.Exists(path))
                return new NotFoundResult();

            var fileBytes = File.ReadAllBytes(path);
            var fileExtension = Path.GetExtension(path).ToLowerInvariant();
            string contentType;

            // Setting content type based on file extension
            switch (fileExtension)
            {
                case ".mp4":
                    contentType = "video/mp4";
                    break;
                case ".avi":
                    contentType = "video/x-msvideo"; // Example content type for AVI files
                    break;
                // Add more cases for other video file extensions if needed
                default:
                    // If file extension is not recognized as a video format, return NotFoundResult
                    return new NotFoundResult();
            }

            return new FileContentResult(fileBytes, contentType);
        }

        public static FileStream GetVideo(ExerciseDto coach)
        {           
            //    if (coach.VideoPath == null || coach.VideoPath.Length <= 0)
            //    {
            //    return new NotFoundResult();
            //}
                var originalFileName = coach.ImageOrVideo;

                // var fileName = Guid.NewGuid().ToString() + Path.GetExtension(originalFileName);
                // Generate a unique filename for the uploaded video
                // var fileName = Guid.NewGuid().ToString() + ".mp4";

                // Define the path where you want to save the video on the server
                var filePath = Path.Combine(Environment.CurrentDirectory, "Uploads/", originalFileName);

                // Save the video file to the server
                //using (var stream = new FileStream(filePath, FileMode.Create))
                //{
                //coach.VideoPath.CopyTo(stream);
                //}

            // החזר את הוידאו כקובץ עם התווים המתאימים של סוג התוכן והפרמטרים הנדרשים בכותרת התגובה
            return new FileStream(filePath, FileMode.Create);
        }
        public static string GetVideo(string videoName)
        {
            if (string.IsNullOrEmpty(videoName))
            {
                throw new ArgumentException("videoName cannot be null or empty", nameof(videoName));
            }

            var videoPath = Path.Combine("uploads", videoName);

            if (!System.IO.File.Exists(videoPath))
            {
                throw new FileNotFoundException("Video not found", videoName);
            }

            return videoPath;
        }


    }
}
