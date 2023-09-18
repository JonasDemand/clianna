using Data.Models.Entities;

namespace Data.Database.Repositories
{
    public class UserRepository : GenericDbRepository<User>, IUserRepository
    {
        public UserRepository(CliannaDbContext dbContext) : base(dbContext)
        {
            
        }
    }
}

