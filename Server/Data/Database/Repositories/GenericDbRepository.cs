using System;
using System.Linq.Expressions;
using Data.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Data.Database.Repositories
{
    public abstract class GenericDbRepository<T> : IGenericRepository<T> where T : class, IEntity
    {
        protected readonly CliannaDbContext _dbContext;

        protected GenericDbRepository(CliannaDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<T> Add(T entity, bool save = true)
        {
            _dbContext.Set<T>().Add(entity);
            if (save)
                await _dbContext.SaveChangesAsync();
            return entity;
        }

        public IDbContextTransaction BeginTransaction()
        {
            return _dbContext.Database.BeginTransaction();
        }

        public async Task<T> Delete(string id, bool save = true)
        {
            var entity = await _dbContext.Set<T>().FindAsync(id);
            if (entity == null)
            {
                return entity;
            }

            _dbContext.Set<T>().Remove(entity);
            if (save)
                await _dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<T> Delete(Expression<Func<T, bool>> predicate, bool save = true)
        {
            var entity = await _dbContext.Set<T>().FirstOrDefaultAsync(predicate);
            if (entity == null)
            {
                return entity;
            }

            _dbContext.Set<T>().Remove(entity);
            if (save)
                await _dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<T> Get(string id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }

        public async Task<List<T>> Get(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().Where(predicate).ToListAsync();
        }

        public async Task<List<T>> GetAll()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        public async Task<T> GetFirstOrDefault(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().FirstOrDefaultAsync(predicate);
        }

        public async Task SaveChanges()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task<T> Update(T entity, bool save = true)
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
            if (save)
                await _dbContext.SaveChangesAsync();
            return entity;
        }
    }
}

