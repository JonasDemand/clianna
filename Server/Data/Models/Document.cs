using System;
namespace Data.Models
{
    public class Document
    {
        public string Id { get; set; }
        public string? GoogleId { get; set; }
        public string? Name { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public bool Template { get; set; } = false;
        public int? IncrementalId { get; set; }
    }
}

