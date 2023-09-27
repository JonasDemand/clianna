using Data.Models.Entities;

namespace Services;

public interface IBaseEntityService<TEntity, TUpsert>
    where TEntity : class, IEntity
    where TUpsert : class
{
    Task<List<TEntity>> GetAll();
    Task<TEntity> GetById(string id);
    Task<TEntity> Create(TUpsert entity);
    Task<TEntity> Update(string id, TUpsert entity);
    Task Delete(string id);
}