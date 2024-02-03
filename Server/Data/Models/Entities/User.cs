using Microsoft.EntityFrameworkCore;
using Visus.Cuid;

namespace Data.Models.Entities;

[EntityTypeConfiguration(typeof(UserEntityTypeConfiguration))]
public class User : IEntity
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Salt { get; set; }
    public bool Enabled { get; set; }

    //Navigation
    public IEnumerable<RefreshToken> RefreshTokens { get; set; }

    public string Id { get; set; } = new Cuid2().ToString();
}