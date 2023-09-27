using System.Linq.Expressions;
using AutoMapper;
using Data.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Data.Database.Repositories;

public abstract class GenericDbRepository<T> : IGenericRepository<T> where T : class, IEntity
{
    protected readonly CliannaDbContext _dbContext;
    protected readonly IMapper _mapper;

    protected GenericDbRepository(CliannaDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<T> Add(T entity, bool save = true)
    {
        await _dbContext.Set<T>().AddAsync(entity);
        if (save)
            await _dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task<List<T>> Add(IEnumerable<T> entities, bool save = true)
    {
        await _dbContext.Set<T>().AddRangeAsync(entities);
        if (save)
            await _dbContext.SaveChangesAsync();
        return entities.ToList();
    }

    public IDbContextTransaction BeginTransaction()
    {
        return _dbContext.Database.BeginTransaction();
    }

    public async Task Delete(string id, bool save = true)
    {
        var entity = await _dbContext.Set<T>().FindAsync(id);

        _dbContext.Set<T>().Remove(entity);
        if (save)
            await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(Expression<Func<T, bool>> predicate, bool save = true)
    {
        var entities = await _dbContext.Set<T>().Where(predicate).ToListAsync();

        _dbContext.Set<T>().RemoveRange(entities);
        if (save)
            await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(T entity, bool save = true)
    {
        _dbContext.Set<T>().Remove(entity);
        if (save)
            await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(IEnumerable<T> entities, bool save = true)
    {
        _dbContext.Set<T>().RemoveRange(entities);
        if (save)
            await _dbContext.SaveChangesAsync();
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
        _dbContext.Set<T>().Update(entity);
        if (save)
            await _dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task<List<T>> Update(IEnumerable<T> entities, bool save = true)
    {
        _dbContext.Set<T>().UpdateRange(entities);
        if (save)
            await _dbContext.SaveChangesAsync();
        return entities.ToList();
    }
}