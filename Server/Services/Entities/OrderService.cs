using AutoMapper;
using Coravel.Queuing.Interfaces;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;
using Services.Tasks;

namespace Services.Entities;

public class OrderService : BaseEntityService<Order, UpsertOrderRequest>, IOrderService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IDocumentRepository _documentRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IQueue _queue;

    public OrderService(ICustomerRepository customerRepository,
        IOrderRepository orderRepository,
        IDocumentRepository documentRepository,
        IMessageRepository messageRepository,
        IMapper mapper,
        IQueue queue) : base(orderRepository, mapper)
    {
        _customerRepository = customerRepository;
        _documentRepository = documentRepository;
        _messageRepository = messageRepository;
        _queue = queue;

        BeforeInsertActions.Add(AssignDependencies);
        BeforeDeleteActions.Add(ScheduleDeleteDocuments);
    }

    private async Task ScheduleDeleteDocuments(Order order)
    {
        order.Documents.ToList().ForEach(document =>
            _queue.QueueInvocableWithPayload<DeleteGoogleFileTask, string>(document.GoogleId));
    }

    private async Task AssignDependencies(Order entry, UpsertOrderRequest order, bool isUpdate)
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

        entry.Documents = order.Documents == null || !order.Documents.Any()
            ? []
            : await _documentRepository.Get(order.Documents);
        entry.Messages = order.Messages == null || !order.Messages.Any()
            ? []
            : await _messageRepository.Get(order.Messages);
    }
}