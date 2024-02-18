namespace Data.Models.Messages;

public class UpsertMessageRequest
{
    public string? Name { get; set; }
    public bool Template { get; set; }
    public string? Subject { get; set; }
    public string? Body { get; set; }

    public string? Order { get; set; }
    public string? Customer { get; set; }
}