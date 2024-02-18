using Data.Models.Enums;

namespace Data.Models.Messages;

public class UpsertDocumentReqeust
{
    public string? Name { get; set; }
    public ETemplateType Template { get; set; }
    public int? IncrementalId { get; set; }

    public string? Order { get; set; }
    public string? Customer { get; set; }
}