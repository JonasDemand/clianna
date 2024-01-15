using AutoMapper;
using Data.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Database.Repositories;

public class DocumentRepository : GenericDbRepository<Document>, IDocumentRepository
{
    public DocumentRepository(CliannaDbContext dbContext, IMapper mapper) : base(dbContext, mapper)
    {
    }

    protected override IQueryable<Document> Query => base.Query.Include(e => e.Order).ThenInclude(e => e.Customer);
}