using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;

namespace Services
{
    public class DocumentService : BaseEntityService<Document, UpsertDocument>, IDocumentService
    {
        public DocumentService(IDocumentRepository documentRepository, IMapper mapper) : base(documentRepository, mapper)
        {
        }
    }
}

