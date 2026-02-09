using Repository.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public interface IService<T>
    {
        public Task<T> GetByIdAsync(int id);
        public Task<List<T>> GetAllByCoachIdAsync(int id);
        public Task<List<T>> GetAllByIdAsync(int id);
        public Task<List<T>> GetAllAsync();
        public Task<T> AddItemAsync(T item);
        public Task UpdateAsync(T item);
        public Task DeleteByIdAsync(int id);
       public Task AddFavoriteExercise(AddExerciseRequest requwst);
       public Task<T> AddFavoritedUserAsync(int exerciseId, int userId);
        public Task DeleteFavoritedUserAsync(int exerciseId, int userId);
    }
}
