using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;
using Data.Models.Misc;
using Microsoft.Extensions.Options;
using Services.ExternalApis;
using File = Google.Apis.Drive.v3.Data.File;

namespace Services.Entities;

public class DocumentService : BaseEntityService<Document, UpsertDocumentReqeust>, IDocumentService
{
    private readonly AppSettings _appSettings;
    private readonly IGoogleService _googleService;

    public DocumentService(IDocumentRepository documentRepository, IMapper mapper, IGoogleService googleService,
        IOptions<AppSettings> appSettings) :
        base(documentRepository, mapper)
    {
        _googleService = googleService;
        _appSettings = appSettings.Value;
    }

    public new async Task<Document> Create(UpsertDocumentReqeust document)
    {
        var documentEntry = _mapper.Map<Document>(document);

        var googleResponse = await _googleService.Drive.Files.Create(new File
        {
            Name = documentEntry.Id,
            MimeType = "application/vnd.google-apps.document",
            Parents = new[] { _appSettings.GoogleOptions.RootFolderId }
        }).ExecuteAsync();
        documentEntry.GoogleId = googleResponse.Id;

        return await _repository.Add(documentEntry);
    }

    public new async Task Delete(string id)
    {
        var document = await _repository.Get(id);
        await _googleService.Drive.Files.Delete(document.GoogleId).ExecuteAsync();
        await _repository.Delete(document);
    }
}