using System.Linq.Expressions;
using AutoMapper;
using Data.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage;

namespace Data.Database.Repositories;

public abstract class GenericDbRepository<T>(CliannaDbContext dbContext, IMapper mapper) : IGenericRepository<T>
    where T : class, IEntity
{
    protected readonly IMapper _mapper = mapper;
    private readonly IEnumerable<Expression<Func<T, object>>> _references = new List<Expression<Func<T, object>>>();

    protected GenericDbRepository(CliannaDbContext dbContext, IMapper mapper,
        IEnumerable<Expression<Func<T, object>>> references) : this(
        dbContext, mapper)
    {
        _references = references;
    }

    public virtual IQueryable<T> Query
    {
        get
        {
            var query = dbContext.Set<T>() as IQueryable<T>;
            return _references.Aggregate(query, (current, property) => current.Include(property));
        }
    }

    public async Task<T> Add(T entity, bool save = true)
    {
        await dbContext.Set<T>().AddAsync(entity);
        if (save)
            await dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task<List<T>> Add(IEnumerable<T> entities, bool save = true)
    {
        await dbContext.Set<T>().AddRangeAsync(entities);
        if (save)
            await dbContext.SaveChangesAsync();
        return entities.ToList();
    }

    public async Task<IDbContextTransaction> BeginTransaction()
    {
        return await dbContext.Database.BeginTransactionAsync();
    }

    public EntityEntry<T> GetEntry(T entity)
    {
        return dbContext.Entry(entity);
    }

    public async Task Delete(string id, bool save = true)
    {
        var entity = await dbContext.Set<T>().FindAsync(id);

        dbContext.Set<T>().Remove(entity);
        if (save)
            await dbContext.SaveChangesAsync();
    }

    public async Task Delete(Expression<Func<T, bool>> predicate, bool save = true)
    {
        var entities = await Query.Where(predicate).ToListAsync();

        dbContext.Set<T>().RemoveRange(entities);
        if (save)
            await dbContext.SaveChangesAsync();
    }

    public async Task Delete(T entity, bool save = true)
    {
        dbContext.Set<T>().Remove(entity);
        if (save)
            await dbContext.SaveChangesAsync();
    }

    public async Task Delete(IEnumerable<T> entities, bool save = true)
    {
        dbContext.Set<T>().RemoveRange(entities);
        if (save)
            await dbContext.SaveChangesAsync();
    }

    public async Task<T> Get(string id)
    {
        return await Query.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<T>> Get(IEnumerable<string> ids)
    {
        return await Query.Where(x => ids.Contains(x.Id)).ToListAsync();
    }

    public async Task<List<T>> Get(Expression<Func<T, bool>> predicate)
    {
        return await Query.Where(predicate).ToListAsync();
    }

    public async Task<List<T>> GetAll()
    {
        return await Query.ToListAsync();
    }

    public async Task<T> GetFirstOrDefault(Expression<Func<T, bool>> predicate)
    {
        return await Query.FirstOrDefaultAsync(predicate);
    }

    public async Task SaveChanges()
    {
        await dbContext.SaveChangesAsync();
    }

    public async Task<T> Update(T entity, bool save = true)
    {
        dbContext.Set<T>().Update(entity);
        if (save)
            await dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task<List<T>> Update(IEnumerable<T> entities, bool save = true)
    {
        dbContext.Set<T>().UpdateRange(entities);
        if (save)
            await dbContext.SaveChangesAsync();
        return entities.ToList();
    }
}