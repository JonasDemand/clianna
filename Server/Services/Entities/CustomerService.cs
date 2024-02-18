using AutoMapper;
using Coravel.Queuing.Interfaces;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;
using Services.Tasks;

namespace Services.Entities;

public class CustomerService : BaseEntityService<Customer, UpsertCustomerRequest>, ICustomerService
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IQueue _queue;

    public CustomerService(ICustomerRepository customerRepository,
        IOrderRepository orderRepository,
        IDocumentRepository documentRepository,
        IMapper mapper, IQueue queue) : base(customerRepository, mapper)
    {
        _orderRepository = orderRepository;
        _documentRepository = documentRepository;
        _queue = queue;

        BeforeInsertActions.Add(AssignDependencies);
        BeforeDeleteActions.Add(ScheduleDeleteDocuments);
    }

    private async Task ScheduleDeleteDocuments(Customer customer)
    {
        customer.Documents.ToList().ForEach(document =>
            _queue.QueueInvocableWithPayload<DeleteGoogleFileTask, string>(document.GoogleId));
        customer.Orders.SelectMany(x => x.Documents).ToList().ForEach(document =>
            _queue.QueueInvocableWithPayload<DeleteGoogleFileTask, string>(document.GoogleId));
    }

    private async Task AssignDependencies(Customer entry, UpsertCustomerRequest customer, bool isUpdate)
    {
        entry.Documents = customer.Documents == null || !customer.Documents.Any()
            ? []
            : await _documentRepository.Get(customer.Documents);
        entry.Orders = customer.Orders == null || !customer.Orders.Any()
            ? []
            : await _orderRepository.Get(customer.Orders);
    }
}