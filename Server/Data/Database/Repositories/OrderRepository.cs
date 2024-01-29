using System.Linq.Expressions;
using AutoMapper;
using Data.Models.Entities;

namespace Data.Database.Repositories;

public class OrderRepository(CliannaDbContext dbContext, IMapper mapper) : GenericDbRepository<Order>(dbContext, mapper,
    new List<Expression<Func<Order, object>>> { e => e.Customer, e => e.Documents }), IOrderRepository;