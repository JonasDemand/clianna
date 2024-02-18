using System.Text.RegularExpressions;
using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Enums;
using Data.Models.Messages;
using Services.Logic;

namespace Services.Entities;

public class MessageService : BaseEntityService<Message, UpsertMessageRequest>, IMessageService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly ITemplatingService _templatingService;

    public MessageService(IMessageRepository messageRepository, IMapper mapper,
        ICustomerRepository customerRepository, IOrderRepository orderRepository,
        ITemplatingService templatingService) : base(messageRepository, mapper)
    {
        _customerRepository = customerRepository;
        _orderRepository = orderRepository;
        _templatingService = templatingService;
        BeforeInsertActions.Add(AssignDependencies);
    }

    public async Task<ApplyMessageTemplateResponse> ApplyTemplate(string id, string? customer, string? order)
    {
        if (string.IsNullOrEmpty(customer) && string.IsNullOrEmpty(order))
            throw new Exception("No reference");

        var message = await GetById(id);
        if (message is { Template: ETemplateType.None })
            throw new Exception("Message has to be a template");

        //Change message, but don't save it afterwards
        message.OrderId = order;
        message.Order = !string.IsNullOrEmpty(order) ? await _orderRepository.Get(order) : null;
        message.CustomerId = customer;
        message.Customer = !string.IsNullOrEmpty(customer) ? await _customerRepository.Get(customer) : null;
        var replacements = _templatingService.ReplaceTextFromObject(message);

        return new ApplyMessageTemplateResponse
        {
            Subject = replacements.Aggregate(message.Subject, (current, replacement) =>
                Regex.Replace(current, replacement.Key, replacement.Value, RegexOptions.IgnoreCase)),
            Body = replacements.Aggregate(message.Body, (current, replacement) =>
                Regex.Replace(current, replacement.Key, replacement.Value, RegexOptions.IgnoreCase))
        };
    }

    private async Task AssignDependencies(Message entry, UpsertMessageRequest document, bool isUpdate)
    {
        if (string.IsNullOrEmpty(document.Customer))
        {
            entry.Customer = null;
            entry.CustomerId = null;
        }
        else
        {
            entry.Customer = await _customerRepository.Get(document.Customer);
            entry.CustomerId = entry.Customer.Id;
        }

        if (string.IsNullOrEmpty(document.Order))
        {
            entry.Order = null;
            entry.OrderId = null;
        }
        else
        {
            entry.Order = await _orderRepository.Get(document.Order);
            entry.OrderId = entry.Order.Id;
        }
    }
}