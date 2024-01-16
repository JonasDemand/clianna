using System.Text.Json;
using Data.Models.Messages.Filtering;
using Microsoft.AspNetCore.Http;

namespace Shared.Extensions;

public static class HttpExtensions
{
    public static void AddPaginationHeader(this HttpResponse response, MetaData metadata, JsonSerializerOptions options)
    {
        response.Headers.Add("Pagination", JsonSerializer.Serialize(metadata, options));
        response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
    }
}