using Data.Models.Entities;

namespace Data.Database.Repositories
{
    public class CustomerRepository : GenericDbRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(CliannaDbContext dbContext) : base(dbContext)
        {

        }
    }
}

