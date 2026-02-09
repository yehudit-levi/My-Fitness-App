using Microsoft.EntityFrameworkCore;
using Repository.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IContext
    {
        public DbSet<Coach> CoachesList { get; set; }
        public DbSet<Exercise> ExercisesList { get; set; }
        public DbSet<User> UsersList { get; set; }
        public DbSet<Comment> CommentsList { get; set; }
        public DbSet<CoachRequests> CoachRequestsList { get; set; }
        public Task Save();
    }
}
