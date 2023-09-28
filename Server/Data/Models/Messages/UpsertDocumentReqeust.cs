namespace Data.Models.Messages;

public class UpsertDocumentReqeust
{
    public string? Name { get; set; }
    public bool Template { get; set; }
    public int? IncrementalId { get; set; }
}