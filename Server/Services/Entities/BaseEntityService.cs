using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages.Filtering;
using Shared.Extensions;

namespace Services.Entities;

public abstract class BaseEntityService<TEntity, TUpsert> : IBaseEntityService<TEntity, TUpsert>
    where TEntity : class, IEntity
    where TUpsert : class
{
    protected readonly IMapper _mapper;
    private readonly IGenericRepository<TEntity> _repository;
    protected readonly List<Func<TEntity, Task>> BeforeDeleteActions = [];

    protected readonly List<Func<TEntity, TUpsert, bool, Task>> BeforeInsertActions = [];

    protected BaseEntityService(IGenericRepository<TEntity> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<TEntity> Create(TUpsert entity)
    {
        var transaction = await _repository.BeginTransaction();
        var entry = _mapper.Map<TEntity>(entity);
        await Task.WhenAll(BeforeInsertActions.Select(action => action(entry, entity, false)));
        await _repository.Add(entry);
        await transaction.CommitAsync();
        return entry;
    }

    public async Task Delete(string id)
    {
        var transaction = await _repository.BeginTransaction();
        var entry = await _repository.Get(id);
        await Task.WhenAll(BeforeDeleteActions.Select(action =>
            action(entry)
        ));
        await _repository.Delete(entry);
        await transaction.CommitAsync();
    }

    public async Task<TEntity> Update(string id, TUpsert entity)
    {
        var transaction = await _repository.BeginTransaction();
        var entry = await _repository.Get(id);
        _mapper.Map(entity, entry);
        await Task.WhenAll(BeforeInsertActions.Select(action => action(entry, entity, true)));
        await _repository.Update(entry);
        await transaction.CommitAsync();
        return entry;
    }

    public async Task<TEntity> GetById(string id)
    {
        return await _repository.Get(id);
    }

    public PagedListResponse<TEntity> GetAll(string searchTerm, IEnumerable<ColumnFilter> columnFilters,
        IEnumerable<ColumnSorting> columnSorting, PaginationParams paginationParams)
    {
        var query = _repository.Query.ApplyFilters(columnFilters, searchTerm).OrderBy(columnSorting);
        var count = query.Count();
        var filteredData = query.CustomPagination(paginationParams.PageNumber, paginationParams.PageSize).ToList();

        var pagedList =
            new PagedListResponse<TEntity>(filteredData, count, paginationParams.PageNumber, paginationParams.PageSize);

        return pagedList;
    }
}