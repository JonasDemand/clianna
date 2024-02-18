using System.Linq.Expressions;
using AutoMapper;
using Data.Models.Entities;

namespace Data.Database.Repositories;

public class MessageRepository(CliannaDbContext dbContext, IMapper mapper)
    : GenericDbRepository<Message>(dbContext, mapper,
        new List<Expression<Func<Message, object>>> { e => e.Customer, e => e.Order }), IMessageRepository
{
}