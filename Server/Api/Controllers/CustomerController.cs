using Api.Attributes;
using Data.Models.Entities;
using Data.Models.Messages;
using Services;

namespace Api.Controllers
{
    [Authorize]
    public class CustomerController : EntityBaseController<Customer, UpsertCustomer>
    {
        public CustomerController(IResponseFactory responseFactory, ICustomerService service) : base(responseFactory, service)
        {
        }
    }
}

