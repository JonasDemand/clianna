using System.Linq.Expressions;
using AutoMapper;
using Data.Models.Entities;

namespace Data.Database.Repositories;

public class DocumentRepository(CliannaDbContext dbContext, IMapper mapper)
    : GenericDbRepository<Document>(dbContext, mapper,
        new List<Expression<Func<Document, object>>> { e => e.Customer, e => e.Order }), IDocumentRepository
{
}