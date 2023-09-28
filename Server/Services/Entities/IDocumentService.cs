using Data.Models.Entities;
using Data.Models.Messages;

namespace Services.Entities;

public interface IDocumentService : IBaseEntityService<Document, UpsertDocumentReqeust>
{
    public Task<Document> Copy(string id, CopyDocumentRequest document);
}