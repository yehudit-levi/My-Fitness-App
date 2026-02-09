using Microsoft.EntityFrameworkCore;
using Repository.Entity;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;

namespace Repository
{
    public class AppDbContext : DbContext, IContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ignore the FileContentResult type
            modelBuilder.Ignore<FileContentResult>();
        }

        public DbSet<Coach> CoachesList { get; set; }
        public DbSet<Exercise> ExercisesList { get; set; }
        public DbSet<User> UsersList { get; set; }
        public DbSet<Comment> CommentsList { get; set; }
        public DbSet<CoachRequests> CoachRequestsList { get; set; }

        public async Task Save()
        {
            await SaveChangesAsync();
        }
    }
}

