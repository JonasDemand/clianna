using Data.Database.Repositories;
using Data.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Services;
using Data.Models.Messages;
using System.Net;

namespace Api.Controllers
{
    public abstract class DbBaseController<T> : BaseController
        where T : class, IEntity
    {
        protected readonly IGenericRepository<T> _repository;

        public DbBaseController(IResponseFactory responseFactory, IGenericRepository<T> repository) : base(responseFactory)
        {
            _repository = repository;
        }


        [HttpGet]
        public async Task<ActionResult<Response<List<T>>>> Get()
        {
            return _responseFactory.Create(await _repository.GetAll());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Response<T>>> Get(string id)
        {
            var entity = await _repository.Get(id);
            if (entity == null)
            {
                return NotFound(_responseFactory.Create(HttpStatusCode.NotFound));
            }
            return _responseFactory.Create(entity);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Response<T>>> Put(string id, T entity)
        {
            if (id != entity.Id)
            {
                return BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest));
            }
            await _repository.Update(entity);
            return _responseFactory.Create(entity);
        }

        [HttpPost]
        public async Task<ActionResult<Response<T>>> Post(T entity)
        {
            await _repository.Add(entity);
            return CreatedAtAction("Get", new { id = entity.Id }, _responseFactory.Create(entity));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Response<T>>> Delete(string id)
        {
            var entity = await _repository.Delete(id);
            if (entity == null)
            {
                return NotFound(_responseFactory.Create(HttpStatusCode.NotFound));
            }
            return _responseFactory.Create(entity);
        }
    }
}

