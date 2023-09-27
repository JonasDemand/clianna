using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;

namespace Services.Entities;

public class CustomerService : BaseEntityService<Customer, UpsertCustomer>, ICustomerService
{
    public CustomerService(ICustomerRepository customerRepository, IMapper mapper) : base(customerRepository,
        mapper)
    {
    }
}