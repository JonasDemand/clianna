﻿using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Visus.Cuid;

namespace Data.Models.Entities;

[EntityTypeConfiguration(typeof(DocumentEntityTypeConfiguration))]
public class Document : IEntity
{
    public string? GoogleId { get; set; }
    public string? Name { get; set; }
    public DateTime CreationDate { get; set; } = DateTime.Now;
    public bool Template { get; set; }
    public int? IncrementalId { get; set; }

    //FK
    [JsonIgnore] public string? OrderId { get; set; }

    [JsonIgnore] public string? CustomerId { get; set; }

    //Navigation
    public virtual Order? Order { get; set; }
    public virtual Customer? Customer { get; set; }

    public string Id { get; set; } = new Cuid2().ToString();
}