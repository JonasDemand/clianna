using Api.Attributes;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;
using Services;

namespace Api.Controllers
{

    [Authorize]
    public class OrderController : EntityBaseController<Order, UpsertOrder>
	{
        public OrderController(IResponseFactory responseFactory, IOrderService service) : base(responseFactory, service)
        {
        }
    }
}