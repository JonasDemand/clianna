using Api.Authentication;
using Data.Database.Repositories;
using Data.Models.Entities;

namespace Api.Controllers
{
    [Authorize]
    public class CustomerController : DbBaseController<Customer>
    {
        public CustomerController(ICustomerRepository repository) : base(repository)
        {

        }
    }
}

