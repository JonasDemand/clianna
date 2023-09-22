using Microsoft.EntityFrameworkCore;
using Visus.Cuid;

namespace Data.Models.Entities
{
    [EntityTypeConfiguration(typeof(UserEntityTypeConfiguration))]
    public class User : IEntity
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }
        public bool Enabled { get; set; }

        public User(bool create)
        {
            SetDefault(create);
        }
        public User() : this(false)
        {
        }

        public void SetDefault(bool create)
        {
            Id = new Cuid2(10).ToString();

            if (create)
            {
                Enabled = false;
            }
        }
    }
}
