using Data.Models.Entities;
using Data.Models.Messages;

namespace Services;

public interface IDocumentService : IBaseEntityService<Document, UpsertDocument>
{
}