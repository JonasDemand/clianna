using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;

namespace Services.Entities;

public class CustomerService : BaseEntityService<Customer, UpsertCustomerRequest>, ICustomerService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IDocumentRepository _documentRepository;
    private readonly IOrderRepository _orderRepository;

    public CustomerService(ICustomerRepository customerRepository, IOrderRepository orderRepository,
        IDocumentRepository documentRepository, IMapper mapper) : base(customerRepository,
        mapper)
    {
        _orderRepository = orderRepository;
        _documentRepository = documentRepository;
        _customerRepository = customerRepository;
    }

    public new async Task<Customer> Create(UpsertCustomerRequest customer)
    {
        var entry = _mapper.Map<Customer>(customer);
        if (customer.Orders != null && customer.Orders.Any())
            entry.Orders = await _orderRepository.Get(customer.Orders);
        if (customer.Documents != null && customer.Documents.Any())
            entry.Documents = await _documentRepository.Get(customer.Documents);
        await _customerRepository.Add(entry);
        entry.Documents = null;
        entry.Orders = null;
        return entry;
    }

    public new async Task<Customer> Update(string id, UpsertCustomerRequest customer)
    {
        var entry = await _customerRepository.Get(id);
        _mapper.Map(customer, entry);
        if (customer.Orders != null && customer.Orders.Any())
            entry.Orders = await _orderRepository.Get(customer.Orders);
        if (customer.Documents != null && customer.Documents.Any())
            entry.Documents = await _documentRepository.Get(customer.Documents);
        await _customerRepository.Update(entry);
        entry.Documents = null;
        entry.Orders = null;
        return entry;
    }
}