using System.Reflection.Metadata;
using Data.Models.Enums;

namespace Data.Models
{
    public class Customer
    {
        public string Id { get; set; }
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
        public CustomerSalutation? Salutation { get; set; }
        public IList<Order> Orders { get; set; }
        public IList<Document> Documents { get; set; }
    }
}

