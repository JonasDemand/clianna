using Data.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Visus.Cuid;

namespace Data.Models.Entities
{
    [EntityTypeConfiguration(typeof(CustomerEntityTypeConfiguration))]
    public class Customer : IEntity
    {
        public string Id { get; set; } = new Cuid2(10).ToString();
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Street { get; set; }
        public string? StreetNumber { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? Phone { get; set; }
        public string? Mobile { get; set; }
        public bool? WhatsApp { get; set; }
        public float? ShoeSize { get; set; }
        public bool? Disabled { get; set; }
        public int? Fibu { get; set; }
        public string? Comment { get; set; }
        public ECustomerSalutation? Salutation { get; set; }

        //Navigation
        public IEnumerable<Order> Orders { get; set; } = new List<Order>();
        public IEnumerable<Document> Documents { get; set; } = new List<Document>();
    }
}
