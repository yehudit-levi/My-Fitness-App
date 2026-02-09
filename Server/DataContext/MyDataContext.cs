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
        public DbSet<Coach> CoachesList { get; set; }
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
        }
    }
}
