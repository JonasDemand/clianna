using Data.Models.Entities;
using Data.Models.Messages;

namespace Services.Entities;

public interface IOrderService : IBaseEntityService<Order, UpsertOrder>
{
}