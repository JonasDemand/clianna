using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;
using OnixLabs.Core.Linq;

namespace Services.Entities;

public class OrderService : BaseEntityService<Order, UpsertOrderRequest>, IOrderService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IDocumentRepository _documentRepository;
    private readonly IOrderRepository _orderRepository;

    public OrderService(ICustomerRepository customerRepository, IOrderRepository orderRepository,
        IDocumentRepository documentRepository, IMapper mapper) : base(orderRepository,
        mapper)
    {
        _orderRepository = orderRepository;
        _documentRepository = documentRepository;
        _customerRepository = customerRepository;
    }

    public new async Task<Order> Create(UpsertOrderRequest order)
    {
        var entry = _mapper.Map<Order>(order);
        await AssignDependencies(entry, order);
        return await _orderRepository.Add(entry);
    }

    public new async Task<Order> Update(string id, UpsertOrderRequest order)
    {
        var entry = await _orderRepository.Get(id);
        _mapper.Map(order, entry);
        await AssignDependencies(entry, order);
        return await _orderRepository.Update(entry);
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
            entry.Customer = await _customerRepository.Get(order.Customer);
            entry.CustomerId = entry.Customer.Id;
        }

        entry.Documents = order.Documents == null || order.Documents.IsEmpty()
            ? new List<Document>()
            : await _documentRepository.Get(order.Documents);
    }
}