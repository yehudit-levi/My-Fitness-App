using AutoMapper;
using Common;
using DocumentFormat.OpenXml.Bibliography;
using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using WebSupergoo.ABCpdf11.Elements;

namespace Service
{
    public class MapProFile : Profile
    {
        public MapProFile()
        {
            CreateMap<Coach, CoachDto>().ReverseMap();
            CreateMap<CoachRequestDto, CoachDto>().ReverseMap();
            CreateMap<Exercise, ExerciseDto>().ReverseMap();
            CreateMap<User, int>().ConvertUsing(user => user.Id);
            CreateMap<CoachRequestDto, CoachRequests>().ReverseMap();
            CreateMap<CoachDto, Coach>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Comment, CommentDto>().ReverseMap();
            CreateMap<Task<Coach>, Task<CoachDto>>().ReverseMap();
            CreateMap<Task<List<CoachRequests>>, Task<List<CoachRequestDto>>>().ReverseMap();
            CreateMap<Task<List<CoachRequestDto>>, Task<List<CoachRequests>>>().ReverseMap();
            CreateMap<Task<List<Coach>>, Task<List<CoachDto>>>().ReverseMap();
            CreateMap<Task<Exercise>, Task<ExerciseDto>>().ReverseMap();
            CreateMap<Task<List<Exercise>>, Task<List<ExerciseDto>>>().ReverseMap();
            CreateMap<Task<User>, Task<UserDto>>().ReverseMap();
            CreateMap<Task<List<User>>, Task<List<UserDto>>>().ReverseMap();
            CreateMap<Task<Comment>, Task<CommentDto>>().ReverseMap();
            CreateMap<Task<List<Comment>>, Task<List<CommentDto>>>().ReverseMap();
            CreateMap<ExerciseDto, Exercise>()
                .ForMember(dest => dest.FavoriteExercises, opt => opt.MapFrom(src =>
                    src.FavoriteExercises.Select(userId => new User { Id = userId }))).ReverseMap();
        }


    }
}
