using System;
using Data.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Database.Repositories
{
    public abstract class GenericDbRepository<T> : IGenericRepository<T> where T : class, IEntity
    {
        protected readonly CliannaDbContext dbContext;

        protected GenericDbRepository(CliannaDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<T> Add(T entity)
        {
            dbContext.Set<T>().Add(entity);
            await dbContext.SaveChangesAsync();
            return entity;
        }

        public async Task<T> Delete(string id)
        {
            var entity = await dbContext.Set<T>().FindAsync(id);
            if (entity == null)
            {
                return entity;
            }

            dbContext.Set<T>().Remove(entity);
            await dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<T> Get(string id)
        {
            return await dbContext.Set<T>().FindAsync(id);
        }

        public async Task<List<T>> GetAll()
        {
            return await dbContext.Set<T>().ToListAsync();
        }

        public async Task<T> Update(T entity)
        {
            dbContext.Entry(entity).State = EntityState.Modified;
            await dbContext.SaveChangesAsync();
            return entity;
        }
    }
}

