using System;
using Api.Authentication;
using Data.Database.Repositories;
using Data.Models.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Authorize]
    public class DocumentController : DbBaseController<Document>
    {
        public DocumentController(IDocumentRepository repository) : base(repository)
        {

        }
    }
}

