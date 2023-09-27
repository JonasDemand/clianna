using AutoMapper;
using Data.Models.Entities;

namespace Data.Database.Repositories;

public class DocumentRepository : GenericDbRepository<Document>, IDocumentRepository
{
    public DocumentRepository(CliannaDbContext dbContext, IMapper mapper) : base(dbContext, mapper)
    {
    }
}