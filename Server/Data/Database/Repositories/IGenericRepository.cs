using Data.Models.Entities;

namespace Data.Database.Repositories
{
    public interface IGenericRepository<T> where T : class, IEntity
    {
        Task<List<T>> GetAll();
        Task<T> Get(string id);
        Task<T> Add(T entity);
        Task<T> Update(T entity);
        Task<T> Delete(string id);
    }
}

