using Api.Attributes;
using Data.Database.Repositories;
using Data.Models.Entities;
using Services;

namespace Api.Controllers
{

    [Authorize]
    public class OrderController : DbBaseController<Order>
	{
        public OrderController(IResponseFactory responseFactory, IOrderRepository repository) : base(responseFactory, repository)
        {
        }
    }
}