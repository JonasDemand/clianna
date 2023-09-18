using Api.Authentication;
using Data.Database.Repositories;
using Data.Models.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{

    [Authorize]
    public class OrderController : DbBaseController<Order>
	{
        public OrderController(IOrderRepository repository) : base(repository)
        {

        }
    }
}