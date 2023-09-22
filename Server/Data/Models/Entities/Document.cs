using Microsoft.EntityFrameworkCore;
using Visus.Cuid;

namespace Data.Models.Entities
{
    [EntityTypeConfiguration(typeof(DocumentEntityTypeConfiguration))]
    public class Document : IEntity
    {
        public string Id { get; set; }
        public string? GoogleId { get; set; }
        public string? Name { get; set; }
        public DateTime CreationDate { get; set; }
        public bool Template { get; set; }
        public int? IncrementalId { get; set; }

        //FK
        public string? OrderId { get; set; }
        public string? CustomerId { get; set; }

        //Navigation
        public Order? Order { get; set; }
        public Customer? Customer { get; set; }

        public Document(bool create)
        {
            SetDefault(create);
        }
        public Document() : this(false)
        {
            
        }

        public void SetDefault(bool create)
        {
            Id = new Cuid2(10).ToString();

            if (create)
            { 
                CreationDate = DateTime.Now;
            }
        }
    }
}
