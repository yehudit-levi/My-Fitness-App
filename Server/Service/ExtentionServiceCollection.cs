using AutoMapper;
using Common;
using DataContext;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver.Core.Configuration;
using Repository;
using Repository.Interfaces;
using Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public static class ExtentionServiceCollection
    {
        public static IServiceCollection AddServices(this IServiceCollection service, string connectionString)
        {
            service.AddRepository();

            service.AddScoped<IService<ExerciseDto>, ExerciseService>();
            service.AddScoped<IService<CoachDto>, CoachService>();
            service.AddScoped<IService<UserDto>, UserService>();
            service.AddScoped<IService<CommentDto>, CommentService>();

            service.AddAutoMapper(typeof(MapProFile));
            service.AddDbContext<MyDataContext>(options =>
              options.UseSqlServer(connectionString));

            // Register IContext to use MyDataContext
            service.AddScoped<IContext, MyDataContext>();

            return service;
            //return service;
        }
    }
}
