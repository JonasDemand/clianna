using System.Net;
using System.Text.Json;
using Data.Models.Entities;
using Data.Models.Messages;
using Data.Models.Messages.Filtering;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.Api;
using Services.Entities;

namespace Api.Controllers.Base;

public abstract class EntityBaseController<TEntity, TUpsert>(
    IResponseFactory responseFactory,
    IBaseEntityService<TEntity, TUpsert> service,
    IOptions<JsonOptions> jsonOptions)
    : BaseController(responseFactory)
    where TEntity : class, IEntity
    where TUpsert : class
{
    private readonly JsonSerializerOptions _jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;

    [HttpGet]
    public ActionResult<Response<PagedListResponse<TEntity>>> Get([FromQuery] SearchParams searchParams)
    {
        var columnFilters = new List<ColumnFilter>();
        if (!string.IsNullOrEmpty(searchParams.ColumnFilters))
            try
            {
                columnFilters.AddRange(
                    JsonSerializer.Deserialize<List<ColumnFilter>>(searchParams.ColumnFilters, _jsonSerializerOptions));
            }
            catch (Exception)
            {
                BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest, "Invalid ColumnFIlters Json"));
            }

        var columnSorting = new List<ColumnSorting>();
        if (!string.IsNullOrEmpty(searchParams.ColumnSorting))
            try
            {
                columnSorting.AddRange(
                    JsonSerializer.Deserialize<List<ColumnSorting>>(searchParams.ColumnSorting,
                        _jsonSerializerOptions));
            }
            catch (Exception)
            {
                BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest, "Invalid OrderBy Json"));
            }

        return Ok(_responseFactory.Create(service.GetAll(searchParams.SearchTerm, columnFilters, columnSorting,
            searchParams)));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<TEntity>>> Get(string id)
    {
        var entity = await service.GetById(id);
        if (entity == null) return NotFound(_responseFactory.Create(HttpStatusCode.NotFound));

        return Ok(_responseFactory.Create(entity));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Response<TEntity>>> Put(string id, TUpsert entity)
    {
        return Ok(_responseFactory.Create(await service.Update(id, entity)));
    }

    [HttpPost]
    public async Task<ActionResult<Response<TEntity>>> Post(TUpsert entity)
    {
        var entry = await service.Create(entity);
        return CreatedAtAction("Get", new { id = entry.Id }, _responseFactory.Create(entry));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Response>> Delete(string id)
    {
        await service.Delete(id);
        return Ok(_responseFactory.Create());
    }
}