using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;

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
        if (!string.IsNullOrEmpty(order.Customer))
            entry.Customer = await _customerRepository.Get(order.Customer);
        if (order.Documents != null && order.Documents.Any())
            entry.Documents = await _documentRepository.Get(order.Documents);
        await _orderRepository.Add(entry);
        entry.Customer = null;
        entry.Documents = null;
        return entry;
    }

    public new async Task<Order> Update(string id, UpsertOrderRequest order)
    {
        var entry = await _orderRepository.Get(id);
        _mapper.Map(order, entry);
        if (!string.IsNullOrEmpty(order.Customer))
            entry.Customer = await _customerRepository.Get(order.Customer);
        if (order.Documents != null && order.Documents.Any())
            entry.Documents = await _documentRepository.Get(order.Documents);
        await _orderRepository.Update(entry);
        entry.Customer = null;
        entry.Documents = null;
        return entry;
    }
}