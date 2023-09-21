using Api.Attributes;
using Data.Database.Repositories;
using Data.Models.Entities;
using Services;

namespace Api.Controllers
{
    [Authorize]
    public class CustomerController : DbBaseController<Customer>
    {
        public CustomerController(IResponseFactory responseFactory, ICustomerRepository repository) : base(responseFactory, repository)
        {
        }


    }
}

