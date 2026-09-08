using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Repository;
using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataContext
{
    public class MyDataContext : DbContext, IContext
    {
        public MyDataContext(DbContextOptions<MyDataContext> options)
            : base(options)
        {
        }
        public DbSet<Exercise> ExercisesList { get; set; }
        public DbSet<Comment> CommentsList { get; set; }
        public DbSet<User> UsersList { get; set; }
        public DbSet<CoachRequests> CoachRequestsList { get; set; }
        public async Task Save()
        {
            await SaveChangesAsync();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(@"server=(localdb)\MSSQLLocaldb;database=SportDb;trusted_connection=true;");
            }
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ignore the FileContentResult type
            modelBuilder.Ignore<Microsoft.AspNetCore.Mvc.FileContentResult>();

            // אחרי איחוד המשתמש/מאמן, יש עכשיו שני קשרים נפרדים בין Exercise ל-User:
            // 1) FavoriteExercises - many-to-many (Exercise.FavoriteExercises <-> User.FavoriteExercises).
            // 2) Coach - הקשר "מי המאמן שיצר את התרגיל" (Exercise.CoachId -> User.Id), חד-כיווני (אין
            //    ICollection<Exercise> בצד ההפוך של User).
            // כש-EF Core מנסה לזהות אוטומטית קשרים בין אותו זוג ישויות מכמה כיוונים, הוא לא תמיד
            // מצליח להחליט לבד איזה FK שייך לאיזה קשר - צריך להגדיר את קשר ה-Coach במפורש כדי
            // להסיר את העמימות. Restrict (ולא Cascade) כדי לא ליצור נתיבי מחיקה מקוננים/מעגליים
            // מול טבלת הקישור של FavoriteExercises.
            modelBuilder.Entity<Exercise>()
                .HasOne(e => e.Coach)
                .WithMany()
                .HasForeignKey(e => e.CoachId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
