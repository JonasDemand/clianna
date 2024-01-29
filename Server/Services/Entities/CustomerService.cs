using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;

namespace Services.Entities;

public class CustomerService(
    ICustomerRepository customerRepository,
    IOrderRepository orderRepository,
    IDocumentRepository documentRepository,
    IMapper mapper)
    : BaseEntityService<Customer, UpsertCustomerRequest>(customerRepository, mapper), ICustomerService
{
    public new async Task<Customer> Create(UpsertCustomerRequest customer)
    {
        var entry = _mapper.Map<Customer>(customer);
        await AssignDependencies(entry, customer);
        return await customerRepository.Add(entry);
    }

    public new async Task<Customer> Update(string id, UpsertCustomerRequest customer)
    {
        var entry = await customerRepository.Get(id);
        _mapper.Map(customer, entry);
        await AssignDependencies(entry, customer);
        return await customerRepository.Update(entry);
    }

    private async Task AssignDependencies(Customer entry, UpsertCustomerRequest customer)
    {
        entry.Documents = customer.Documents == null || !customer.Documents.Any()
            ? new List<Document>()
            : await documentRepository.Get(customer.Documents);
        entry.Orders = customer.Orders == null || !customer.Orders.Any()
            ? new List<Order>()
            : await orderRepository.Get(customer.Orders);
    }
}