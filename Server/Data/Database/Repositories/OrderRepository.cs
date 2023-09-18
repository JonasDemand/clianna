using Data.Models.Entities;

namespace Data.Database.Repositories
{
	public class OrderRepository : GenericDbRepository<Order>, IOrderRepository
	{
		public OrderRepository(CliannaDbContext dbContext) : base(dbContext)
		{
		}
	}
}

