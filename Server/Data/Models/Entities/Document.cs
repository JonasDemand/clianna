using Microsoft.EntityFrameworkCore;
using Visus.Cuid;

namespace Data.Models.Entities
{
    [EntityTypeConfiguration(typeof(DocumentEntityTypeConfiguration))]
    public class Document : IEntity
    {
        public string Id { get; set; } = new Cuid2(10).ToString();
        public string? GoogleId { get; set; }
        public string? Name { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public bool Template { get; set; }
        public int? IncrementalId { get; set; }

        //FK
        public string? OrderId { get; set; }
        public string? CustomerId { get; set; }

        //Navigation
        public Order? Order { get; set; }
        public Customer? Customer { get; set; }
    }
}
