using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Messages;
using Data.Models.Misc;
using Google.Apis.Docs.v1.Data;
using Microsoft.Extensions.Options;
using Services.ExternalApis;
using Services.Logic;
using Document = Data.Models.Entities.Document;
using File = Google.Apis.Drive.v3.Data.File;

namespace Services.Entities;

public class DocumentService(
    IDocumentRepository documentRepository,
    ICustomerRepository customerRepository,
    IOrderRepository orderRepository,
    IMapper mapper,
    IGoogleService googleService,
    ITemplatingService templatingService,
    IOptions<AppSettings> appSettings)
    : BaseEntityService<Document, UpsertDocumentReqeust>(documentRepository, mapper), IDocumentService
{
    private readonly AppSettings _appSettings = appSettings.Value;

    public new async Task<Document> Create(UpsertDocumentReqeust document)
    {
        var transaction = documentRepository.BeginTransaction();
        var entry = _mapper.Map<Document>(document);
        await AssignDependencies(entry, document);

        var googleResponse = await googleService.Drive.Files.Create(new File
        {
            Name = entry.Id,
            MimeType = "application/vnd.google-apps.document",
            Parents = new[] { _appSettings.GoogleOptions.RootFolderId }
        }).ExecuteAsync();
        entry.GoogleId = googleResponse.Id;

        await documentRepository.Add(entry);
        await transaction.CommitAsync();
        return entry;
    }

    public new async Task<Document> Update(string id, UpsertDocumentReqeust document)
    {
        var entry = await documentRepository.Get(id);
        _mapper.Map(document, entry);
        await AssignDependencies(entry, document);
        return await documentRepository.Update(entry);
    }

    public new async Task Delete(string id)
    {
        var transaction = documentRepository.BeginTransaction();
        var document = await documentRepository.Get(id);
        await googleService.Drive.Files.Delete(document.GoogleId).ExecuteAsync();
        await documentRepository.Delete(document);
        await transaction.CommitAsync();
    }

    public async Task<Document> Copy(string id, CopyDocumentRequest document)
    {
        var transaction = documentRepository.BeginTransaction();
        var documentToCopy = await documentRepository.Get(id);
        if (documentToCopy == null) throw new Exception("Document not found");

        var newDocument = _mapper.Map<Document>(document);
        newDocument.IncrementalId = documentToCopy.IncrementalId;
        if (!string.IsNullOrEmpty(document.Order))
            newDocument.Order = await orderRepository.Get(document.Order);
        else if (!string.IsNullOrEmpty(document.Customer))
            newDocument.Customer = await customerRepository.Get(document.Customer);
        else
            newDocument.Template = documentToCopy.Template;

        var driveResponse = await googleService.Drive.Files.Copy(new File
        {
            Name = newDocument.Id,
            MimeType = "application/vnd.google-apps.document",
            Parents = new[] { _appSettings.GoogleOptions.RootFolderId }
        }, documentToCopy.GoogleId).ExecuteAsync();
        newDocument.GoogleId = driveResponse.Id;

        if (documentToCopy.Template && (newDocument.Order != null || newDocument.Customer != null))
        {
            await googleService.Docs.Documents
                .BatchUpdate(new BatchUpdateDocumentRequest
                {
                    Requests = templatingService.ReplaceTextFromObject(newDocument).Select(replacement => new Request
                        {
                            ReplaceAllText = new ReplaceAllTextRequest
                            {
                                ContainsText = new SubstringMatchCriteria
                                {
                                    Text = replacement.ReplaceTemplate,
                                    MatchCase = false
                                },
                                ReplaceText = replacement.ReplaceValue
                            }
                        })
                        .ToList()
                }, newDocument.GoogleId).ExecuteAsync();
            if (documentToCopy.IncrementalId != null) documentToCopy.IncrementalId++;
        }

        await documentRepository.Add(newDocument);

        await transaction.CommitAsync();
        return newDocument;
    }

    private async Task AssignDependencies(Document entry, UpsertDocumentReqeust document)
    {
        if (string.IsNullOrEmpty(document.Customer))
        {
            entry.Customer = null;
            entry.CustomerId = null;
        }
        else
        {
            entry.Customer = await customerRepository.Get(document.Customer);
            entry.CustomerId = entry.Customer.Id;
        }

        if (string.IsNullOrEmpty(document.Order))
        {
            entry.Order = null;
            entry.Order = null;
        }
        else
        {
            entry.Order = await orderRepository.Get(document.Order);
            entry.OrderId = entry.Order.Id;
        }
    }
}