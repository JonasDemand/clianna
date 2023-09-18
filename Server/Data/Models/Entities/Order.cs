using Data.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Visus.Cuid;

namespace Data.Models.Entities
{
    [EntityTypeConfiguration(typeof(OrderEntityTypeConfiguration))]
    public class Order : IEntity
    {
        public string Id { get; set; } = new Cuid2(10).ToString();
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public bool Pending { get; set; } = true;
        public OrderShippingType? ShippingType { get; set; }
        public string? Comment { get; set; }
        public float? Price { get; set; }
        public OrderTax? Taxes { get; set; }
        public DateTime? DueDate { get; set; }
        public OrderType? Type { get; set; }
        public string? Brand { get; set; }
        public string? Article { get; set; }
        public string? Color { get; set; }
        public string? Dealer { get; set; }
        public float? Size { get; set; }
        public string? Name { get; set; }

        //FK
        public string? CustomerId { get; set; }

        //Navigation
        public IEnumerable<Document> Documents { get; set; } = new List<Document>();
        public Customer? Customer { get; set; }
    }
}
