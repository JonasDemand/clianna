using System.Linq.Expressions;
using AutoMapper;
using Data.Models.Entities;

namespace Data.Database.Repositories;

public class OrderRepository : GenericDbRepository<Order>, IOrderRepository
{
    public OrderRepository(CliannaDbContext dbContext, IMapper mapper) : base(dbContext, mapper,
        new List<Expression<Func<Order, object>>> { e => e.Customer, e => e.Documents })
    {
    }
}