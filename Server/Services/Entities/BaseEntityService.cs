using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages.Filtering;
using Shared.Extensions;

namespace Services.Entities;

public class BaseEntityService<TEntity, TUpsert> : IBaseEntityService<TEntity, TUpsert>
    where TEntity : class, IEntity
    where TUpsert : class
{
    protected readonly IMapper _mapper;
    private readonly IGenericRepository<TEntity> _repository;

    protected BaseEntityService(IGenericRepository<TEntity> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }


    public async Task<TEntity> Create(TUpsert entity)
    {
        return await _repository.Add(_mapper.Map<TEntity>(entity));
    }

    public async Task Delete(string id)
    {
        await _repository.Delete(id);
    }

    public async Task<TEntity> GetById(string id)
    {
        return await _repository.Get(id);
    }

    public async Task<TEntity> Update(string id, TUpsert entity)
    {
        var entry = await _repository.Get(id);
        _mapper.Map(entity, entry);
        return await _repository.Update(entry);
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