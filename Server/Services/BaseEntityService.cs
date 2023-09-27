using AutoMapper;
using Data.Database;
using Data.Database.Repositories;
using Data.Models.Entities;

namespace Services
{
    public class BaseEntityService<TEntity, TUpsert> : IBaseEntityService<TEntity, TUpsert>
        where TEntity : class, IEntity
        where TUpsert : class
    {
        protected readonly IGenericRepository<TEntity> _repository;
        protected readonly IMapper _mapper;

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

        public async Task<List<TEntity>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<TEntity> Update(string id, TUpsert entity)
        {
            var entry = await _repository.Get(id);
            _mapper.Map(entity, entry);
            return await _repository.Update(entry);
        }
    }
}

