using System.Linq.Expressions;
using AutoMapper;
using Data.Models.Entities;

namespace Data.Database.Repositories;

public class CustomerRepository : GenericDbRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(CliannaDbContext dbContext, IMapper mapper) : base(dbContext, mapper,
        new List<Expression<Func<Customer, object>>> { e => e.Documents, e => e.Orders })
    {
    }
}