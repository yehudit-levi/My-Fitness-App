using Common;
using Repository.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IRepository<T>
    {
        Task<T?> getByIdAsync(int id);
        Task<List<T>> getAllAsync();
        Task<T> addAsync(T item);
        Task updateAsync(T item);
        Task deleteByIdAsync(int id);
        Task addFavoriteExercise(AddExerciseRequest requwst);
        Task<T> addFavoritedUser(int userId, int exerciseId);
        Task deleteFavoritedUserAsync(int userId, int exerciseId);
        Task<List<T>> getAllByIdAsync(int id);
    }
}
