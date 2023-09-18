using Data.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Database.Repositories
{
    public abstract class GenericRepository<T> : IGenericRepository<T> where T : class, IEntity
    {
        protected readonly CliannaDbContext _dbContext;

        protected GenericRepository(CliannaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<T> Get(string id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetAll()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        public async Task Add(T entity)
        {
            await _dbContext.Set<T>().AddAsync(entity);
        }

        public void Delete(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
        }

        public void Update(T entity)
        {
            _dbContext.Set<T>().Update(entity);
        }
    }
}

