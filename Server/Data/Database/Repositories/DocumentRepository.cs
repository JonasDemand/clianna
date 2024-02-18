using AutoMapper;
using Data.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Database.Repositories;

public class DocumentRepository(CliannaDbContext dbContext, IMapper mapper)
    : GenericDbRepository<Document>(dbContext, mapper), IDocumentRepository
{
    public override IQueryable<Document> Query
    {
        get { return base.Query.Include(e => e.Customer).Include(e => e.Order).ThenInclude(e => e.Customer); }
    }
}