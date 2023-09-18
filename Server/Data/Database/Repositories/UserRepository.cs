using Data.Models.Entities;

namespace Data.Database.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(CliannaDbContext dbContext) : base(dbContext)
        {

        }
    }
}

