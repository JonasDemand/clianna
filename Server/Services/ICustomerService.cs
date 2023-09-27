using Data.Models.Entities;
using Data.Models.Messages;

namespace Services
{
	public interface ICustomerService : IBaseEntityService<Customer, UpsertCustomer>
	{
	}
}
