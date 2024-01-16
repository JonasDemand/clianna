using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Api.Config;

public class CustomModelDocumentFilter<T> : IDocumentFilter where T : class
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        context.SchemaGenerator.GenerateSchema(typeof(T), context.SchemaRepository);
    }
}