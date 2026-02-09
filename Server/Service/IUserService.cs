using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public interface IUserService : IService<UserDto>
    {
        Task AddFavoriteExercise(int idUser, List<int> idExecises);
        //public Task AddFavoriteExercise(int idUser, List<int> idExecises);
    }
}
