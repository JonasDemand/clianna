using Data.Models.Entities;

namespace Data.Database.Repositories
{
    public interface IGenericRepository<T> where T : class, IEntity
    {
        Task<T> Get(string id);
        Task<IEnumerable<T>> GetAll();
        Task Add(T entity);
        void Delete(T entity);
        void Update(T entity);
    }
}

