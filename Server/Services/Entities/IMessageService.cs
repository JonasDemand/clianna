using Data.Models.Entities;
using Data.Models.Messages;

namespace Services.Entities;

public interface IMessageService : IBaseEntityService<Message, UpsertMessageRequest>
{
    public Task<ApplyMessageTemplateResponse> ApplyTemplate(string id, string? customer, string? order);
}