using Data.Models.Entities;
using Data.Models.Messages.Filtering;

namespace Services.Entities;

public interface IBaseEntityService<TEntity, TUpsert>
    where TEntity : class, IEntity
    where TUpsert : class
{
    PagedList<TEntity> GetAll(string? searchTerm, IEnumerable<ColumnFilter> columnFilters,
        IEnumerable<ColumnSorting> columnSorting, PaginationParams paginationParams);

    Task<TEntity> GetById(string id);
    Task<TEntity> Create(TUpsert entity);
    Task<TEntity> Update(string id, TUpsert entity);
    Task Delete(string id);
}