using System.Linq.Expressions;
using Data.Models.Entities;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage;

namespace Data.Database.Repositories;

public interface IGenericRepository<T> where T : class, IEntity
{
    Task<List<T>> GetAll();
    Task<T> Get(string id);
    Task<List<T>> Get(IEnumerable<string> ids);
    Task<List<T>> Get(Expression<Func<T, bool>> predicate);
    Task<T> GetFirstOrDefault(Expression<Func<T, bool>> predicate);
    Task<T> Add(T entity, bool save = true);
    Task<List<T>> Add(IEnumerable<T> entities, bool save = true);
    Task<T> Update(T entity, bool save = true);
    Task<List<T>> Update(IEnumerable<T> entities, bool save = true);
    Task Delete(string id, bool save = true);
    Task Delete(Expression<Func<T, bool>> predicate, bool save = true);
    Task Delete(T entity, bool save = true);
    Task Delete(IEnumerable<T> entities, bool save = true);
    Task SaveChanges();
    IDbContextTransaction BeginTransaction();
    EntityEntry<T> GetEntry(T entity);
}