using Microsoft.EntityFrameworkCore;
using Visus.Cuid;

namespace Data.Models.Database
{
    [EntityTypeConfiguration(typeof(UserEntityTypeConfiguration))]
    public class User
    {
        public string Id { get; set; } = new Cuid2(10).ToString();
        public string Email { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }
        public bool Enabled { get; set; } = false;
    }
}
