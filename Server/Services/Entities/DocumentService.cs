using AutoMapper;
using Coravel.Queuing.Interfaces;
using Data.Database.Repositories;
using Data.Models.Enums;
using Data.Models.Messages;
using Data.Models.Misc;
using Google.Apis.Docs.v1.Data;
using Microsoft.Extensions.Options;
using Services.ExternalApis;
using Services.Logic;
using Services.Tasks;
using Document = Data.Models.Entities.Document;
using File = Google.Apis.Drive.v3.Data.File;

namespace Services.Entities;

public class DocumentService : BaseEntityService<Document, UpsertDocumentReqeust>, IDocumentService
{
    private readonly AppSettings _appSettings;
    private readonly ICustomerRepository _customerRepository;
    private readonly IDocumentRepository _documentRepository;
    private readonly IGoogleService _googleService;
    private readonly IOrderRepository _orderRepository;
    private readonly IQueue _queue;
    private readonly ITemplatingService _templatingService;

    public DocumentService(IDocumentRepository documentRepository,
        ICustomerRepository customerRepository,
        IOrderRepository orderRepository,
        IMapper mapper,
        IGoogleService googleService,
        ITemplatingService templatingService,
        IQueue queue,
        IOptions<AppSettings> appSettings) : base(documentRepository, mapper)
    {
        _documentRepository = documentRepository;
        _customerRepository = customerRepository;
        _orderRepository = orderRepository;
        _googleService = googleService;
        _templatingService = templatingService;
        _queue = queue;
        _appSettings = appSettings.Value;

        BeforeInsertActions.Add(BeforeInsertAction);
        BeforeDeleteActions.Add(ScheduleDeleteDocument);
    }

    public async Task<Document> Copy(string id, CopyDocumentRequest document)
    {
        var transaction = await _documentRepository.BeginTransaction();
        var documentToCopy = await _documentRepository.Get(id);
        if (documentToCopy == null) throw new Exception("Document not found");

        var newDocument = _mapper.Map<Document>(document);
        newDocument.IncrementalId = documentToCopy.IncrementalId;
        if (!string.IsNullOrEmpty(document.Order))
            newDocument.Order = await _orderRepository.Get(document.Order);
        else if (!string.IsNullOrEmpty(document.Customer))
            newDocument.Customer = await _customerRepository.Get(document.Customer);
        else
            newDocument.Template = documentToCopy.Template;

        var driveResponse = await _googleService.Drive.Files.Copy(new File
        {
            Name = newDocument.Id,
            MimeType = "application/vnd.google-apps.document",
            Parents = new[] { _appSettings.GoogleOptions.RootFolderId }
        }, documentToCopy.GoogleId).ExecuteAsync();
        newDocument.GoogleId = driveResponse.Id;

        if (documentToCopy.Template != ETemplateType.None &&
            (newDocument.Order != null || newDocument.Customer != null))
        {
            await _googleService.Docs.Documents
                .BatchUpdate(new BatchUpdateDocumentRequest
                {
                    Requests = _templatingService.ReplaceTextFromObject(newDocument).Select(replacement => new Request
                        {
                            ReplaceAllText = new ReplaceAllTextRequest
                            {
                                ContainsText = new SubstringMatchCriteria
                                {
                                    Text = replacement.Key,
                                    MatchCase = false
                                },
                                ReplaceText = replacement.Value
                            }
                        })
                        .ToList()
                }, newDocument.GoogleId).ExecuteAsync();
            if (documentToCopy.IncrementalId != null) documentToCopy.IncrementalId++;
        }

        await _documentRepository.Add(newDocument);

        await transaction.CommitAsync();
        return newDocument;
    }

    private async Task ScheduleDeleteDocument(Document document)
    {
        _queue.QueueInvocableWithPayload<DeleteGoogleFileTask, string>(document.GoogleId);
    }

    private async Task BeforeInsertAction(Document entry, UpsertDocumentReqeust document, bool isUpdate)
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

        if (isUpdate) return;

        var googleResponse = await _googleService.Drive.Files.Create(new File
        {
            Name = entry.Id,
            MimeType = "application/vnd.google-apps.document",
            Parents = new[] { _appSettings.GoogleOptions.RootFolderId }
        }).ExecuteAsync();
        entry.GoogleId = googleResponse.Id;
    }
}