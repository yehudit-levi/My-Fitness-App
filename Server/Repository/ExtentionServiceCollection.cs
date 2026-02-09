using Microsoft.Extensions.DependencyInjection;
using Repository.Entity;
using Repository.Interfaces;
using Repository.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public static class ExtentionServiceCollection
    {
        public static IServiceCollection AddRepository(this IServiceCollection service)
        {
            service.AddScoped<IRepository<Exercise>, ExerciseRepository>();
            service.AddScoped<IRepository<Coach>, CoachRepository>();
            service.AddScoped<IRepository<User>, UserRepository>();
            service.AddScoped<IRepository<Comment>, CommentRepository>();

            return service;
        }
    }
}
