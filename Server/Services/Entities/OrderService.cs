using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;

namespace Services.Entities;

public class OrderService : BaseEntityService<Order, UpsertOrder>, IOrderService
{
    public OrderService(IOrderRepository orderRepository, IMapper mapper) : base(orderRepository, mapper)
    {
    }
}