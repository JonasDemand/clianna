using Data.Models.Enums;

namespace Data.Models
{
    public class Order
    {
        public string Id { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public bool Pending { get; set; } = true;
        public OrderShippingType? ShippingType { get; set; }
        public string? Comment { get; set; }
        public float? Price { get; set; }
        public OrderTax? Taxes { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Brand { get; set; }
        public string? Article { get; set; }
        public string? Color { get; set; }
        public string? Dealer { get; set; }
        public float? Size { get; set; }
        public string? Name { get; set; }
        public Customer? Customer { get; set; }
        public IList<Document> Documents { get; set; }
    }
}

