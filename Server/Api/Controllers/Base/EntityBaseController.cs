using System.Net;
using Data.Models.Entities;
using Data.Models.Messages;
using Microsoft.AspNetCore.Mvc;
using Services.Api;
using Services.Entities;

namespace Api.Controllers.Base;

public abstract class EntityBaseController<TEntity, TUpsert> : BaseController
    where TEntity : class, IEntity
    where TUpsert : class
{
    private readonly IBaseEntityService<TEntity, TUpsert> _service;

    protected EntityBaseController(IResponseFactory responseFactory, IBaseEntityService<TEntity, TUpsert> service) :
        base(responseFactory)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<Response<List<TEntity>>>> Get()
    {
        return Ok(_responseFactory.Create(await _service.GetAll()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<TEntity>>> Get(string id)
    {
        var entity = await _service.GetById(id);
        if (entity == null) return NotFound(_responseFactory.Create(HttpStatusCode.NotFound));

        return Ok(_responseFactory.Create(entity));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Response<TEntity>>> Put(string id, TUpsert entity)
    {
        return Ok(_responseFactory.Create(await _service.Update(id, entity)));
    }

    [HttpPost]
    public async Task<ActionResult<Response<TEntity>>> Post(TUpsert entity)
    {
        var entry = await _service.Create(entity);
        return CreatedAtAction("Get", new { id = entry.Id }, _responseFactory.Create(entry));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Response>> Delete(string id)
    {
        await _service.Delete(id);
        return Ok(_responseFactory.Create());
    }
}