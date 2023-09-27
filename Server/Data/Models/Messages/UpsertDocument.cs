namespace Data.Models.Messages
{
	public class UpsertDocument
    {
        public string? Name { get; set; }
        public bool Template { get; set; }
        public int? IncrementalId { get; set; }
    }
}

