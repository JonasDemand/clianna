using System.Text.Json.Serialization;
using Data.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Visus.Cuid;

namespace Data.Models.Entities;

[EntityTypeConfiguration(typeof(MessageEntityTypeConfiguration))]
public class Message : IEntity
{
    public string? Name { get; set; }
    public DateTime CreationDate { get; set; } = DateTime.UtcNow;
    public ETemplateType Template { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }

    //FK
    [JsonIgnore] public string? OrderId { get; set; }

    [JsonIgnore] public string? CustomerId { get; set; }

    //Navigation
    public Order? Order { get; set; }
    public Customer? Customer { get; set; }

    public string Id { get; set; } = new Cuid2().ToString();
}