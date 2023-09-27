using Data.Models.Entities;
using Data.Models.Messages;

namespace Services
{
    public interface IOrderService : IBaseEntityService<Order, UpsertOrder>
    {
    }
}
