using System;
using Data.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Database.Repositories
{
    public abstract class GenericDbRepository<T> : IGenericRepository<T> where T : class, IEntity
    {
        protected readonly CliannaDbContext _dbContext;

        protected GenericDbRepository(CliannaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<T> Add(T entity)
        {
            _dbContext.Set<T>().Add(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task<T> Delete(string id)
        {
            var entity = await _dbContext.Set<T>().FindAsync(id);
            if (entity == null)
            {
                return entity;
            }

            _dbContext.Set<T>().Remove(entity);
            await _dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<T> Get(string id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }

        public async Task<List<T>> GetAll()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        public async Task<T> Update(T entity)
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return entity;
        }
    }
}

