using Microsoft.EntityFrameworkCore;

namespace Data.Models
{
    [EntityTypeConfiguration(typeof(UserEntityTypeConfiguration))]
    public class User
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public string? Salt { get; set; }
        public bool Enabled { get; set; } = false;
    }
}
