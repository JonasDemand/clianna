using Data.Database.Repositories;
using Data.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Api.Authentication;

namespace Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public abstract class DbBaseController<T> : ControllerBase
        where T : class, IEntity
    {
        private readonly IGenericRepository<T> _repository;

        public DbBaseController(IGenericRepository<T> repository)
        {
            _repository = repository;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<T>>> Get()
        {
            return await _repository.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<T>> Get(string id)
        {
            var entity = await _repository.Get(id);
            if (entity == null)
            {
                return NotFound();
            }
            return entity;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, T entity)
        {
            if (id != entity.Id)
            {
                return BadRequest();
            }
            await _repository.Update(entity);
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<T>> Post(T entity)
        {
            await _repository.Add(entity);
            return CreatedAtAction("Get", new { id = entity.Id }, entity);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<T>> Delete(string id)
        {
            var movie = await _repository.Delete(id);
            if (movie == null)
            {
                return NotFound();
            }
            return movie;
        }
    }
}

