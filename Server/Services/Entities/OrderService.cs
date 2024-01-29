using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;

namespace Services.Entities;

public class OrderService(
    ICustomerRepository customerRepository,
    IOrderRepository orderRepository,
    IDocumentRepository documentRepository,
    IMapper mapper)
    : BaseEntityService<Order, UpsertOrderRequest>(orderRepository, mapper), IOrderService
{
    public new async Task<Order> Create(UpsertOrderRequest order)
    {
        var entry = _mapper.Map<Order>(order);
        await AssignDependencies(entry, order);
        return await orderRepository.Add(entry);
    }

    public new async Task<Order> Update(string id, UpsertOrderRequest order)
    {
        var entry = await orderRepository.Get(id);
        _mapper.Map(order, entry);
        await AssignDependencies(entry, order);
        return await orderRepository.Update(entry);
    }

    private async Task AssignDependencies(Order entry, UpsertOrderRequest order)
    {
        if (string.IsNullOrEmpty(order.Customer))
        {
            entry.Customer = null;
            entry.CustomerId = null;
        }
        else
        {
            entry.Customer = await customerRepository.Get(order.Customer);
            entry.CustomerId = entry.Customer.Id;
        }

        entry.Documents = order.Documents == null || !order.Documents.Any()
            ? []
            : await documentRepository.Get(order.Documents);
    }
}