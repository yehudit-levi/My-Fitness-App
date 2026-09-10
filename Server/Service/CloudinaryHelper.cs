using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace Service
{
    // עוטף את השימוש ב-Cloudinary SDK להעלאת קבצים (תמונות, ובעתיד גם וידאו) לאחסון בענן,
    // ומחזיר את כתובת ה-URL הציבורית והמאובטחת (HTTPS) של הקובץ שהועלה - זה מה שנשמר מעכשיו
    // בשדות כמו ProfilePicturePath/CertificationPath, במקום נתיב מקומי על דיסק השרת (שנמחק
    // בכל הפעלה מחדש/פריסה מחדש אצל רוב ספקי האחסון בענן שבהם השרת ירוץ בעתיד).
    public static class CloudinaryHelper
    {
        private static Cloudinary? cloudinary;

        private static Cloudinary GetClient(IConfiguration config)
        {
            if (cloudinary != null) return cloudinary;

            var cloudName = config["CloudinarySettings:CloudName"];
            var apiKey = config["CloudinarySettings:ApiKey"];
            var apiSecret = config["CloudinarySettings:ApiSecret"];

            if (string.IsNullOrWhiteSpace(cloudName) || string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(apiSecret))
            {
                throw new InvalidOperationException(
                    "חסרות הגדרות Cloudinary (CloudinarySettings:CloudName/ApiKey/ApiSecret) - יש להגדיר אותן ב-User Secrets.");
            }

            var account = new Account(cloudName, apiKey, apiSecret);
            cloudinary = new Cloudinary(account);
            return cloudinary;
        }

        // מעלה קובץ תמונה לתיקייה נתונה בחשבון ה-Cloudinary, ומחזיר את ה-URL המאובטח שלו.
        public static async Task<string> UploadImageAsync(IConfiguration config, IFormFile image, string folder)
        {
            if (image == null || image.Length == 0)
            {
                throw new ArgumentException("No image provided or image is empty.");
            }

            var client = GetClient(config);

            using var stream = image.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(image.FileName, stream),
                Folder = folder,
            };

            var result = await client.UploadAsync(uploadParams);

            if (result.Error != null)
            {
                throw new ArgumentException($"Cloudinary upload failed: {result.Error.Message}");
            }

            return result.SecureUrl.ToString();
        }

        // מעלה קובץ וידאו לתיקייה נתונה בחשבון ה-Cloudinary, ומחזיר את ה-URL המאובטח שלו.
        // VideoUploadParams (ולא ImageUploadParams) גורם ל-Cloudinary לזהות את הקובץ כ-video.
        // מבצעים טרנספורמציה חד-פעמית לקידוד H.264/AAC (ראו הסבר למטה) - זו ההוצאה
        // המכוונת היחידה בקרדיטים כאן, הכרחית כדי שהסרטון באמת יתנגן בדפדפן.
        public static async Task<string> UploadVideoAsync(IConfiguration config, IFormFile video, string folder)
        {
            if (video == null || video.Length == 0)
            {
                throw new ArgumentException("No video provided or video is empty.");
            }

            var client = GetClient(config);

            using var stream = video.OpenReadStream();
            var uploadParams = new VideoUploadParams
            {
                File = new FileDescription(video.FileName, stream),
                Folder = folder,
                // סרטונים מטלפון (גם בקונטיינר .mp4) לעיתים קרובות מקודדים ב-HEVC/H.265,
                // שרוב הדפדפנים (Chrome ואחרים) לא יודעים לנגן ב-<video>. כדי שהסרטון באמת
                // יתנגן אצל כל משתמש, מבקשים מ-Cloudinary לתמלל (transcode) פעם אחת בזמן
                // ההעלאה ל-H.264/AAC - הפורמט הכי נתמך באופן אוניברסלי בדפדפנים.
                Transformation = new Transformation().VideoCodec("h264").AudioCodec("aac"),
            };

            var result = await client.UploadAsync(uploadParams);

            if (result.Error != null)
            {
                throw new ArgumentException($"Cloudinary upload failed: {result.Error.Message}");
            }

            return result.SecureUrl.ToString();
        }
    }
}
