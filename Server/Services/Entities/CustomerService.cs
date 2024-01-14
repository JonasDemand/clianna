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
        await AssignDependencies(entry, customer);
        return await _customerRepository.Add(entry);
    }

    public new async Task<Customer> Update(string id, UpsertCustomerRequest customer)
    {
        var entry = await _customerRepository.Get(id);
        _mapper.Map(customer, entry);
        await AssignDependencies(entry, customer);
        return await _customerRepository.Update(entry);
    }

    private async Task AssignDependencies(Customer entry, UpsertCustomerRequest customer)
    {
        entry.Documents = customer.Documents == null || customer.Documents.Any()
            ? new List<Document>()
            : await _documentRepository.Get(customer.Documents);
        entry.Orders = customer.Orders == null || customer.Orders.Any()
            ? new List<Order>()
            : await _orderRepository.Get(customer.Orders);
    }
}