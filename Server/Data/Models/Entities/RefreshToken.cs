using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Visus.Cuid;

namespace Data.Models.Entities;

[EntityTypeConfiguration(typeof(RefreshTokenTypeConfiguration))]
public class RefreshToken : IEntity
{
    public string Token { get; set; }
    public DateTime CreationDate { get; set; } = DateTime.Now;

    //FK
    [JsonIgnore] public string UserId { get; set; }

    //Navigation
    public User User { get; set; }

    public string Id { get; set; } = new Cuid2().ToString();
}