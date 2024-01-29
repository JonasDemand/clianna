namespace Data.Models.Messages.Filtering;

public class PagedListResponse<T>(IEnumerable<T> items, int count, int pageNumber, int pageSize)
{
    public PaginationMetaData MetaData { get; set; } = new()
    {
        TotalCount = count,
        PageSize = pageSize,
        CurrentPage = pageNumber,
        TotalPages = (int)Math.Ceiling(count / (double)pageSize)
    };

    public IEnumerable<T> List { get; set; } = items;
}

public class PaginationMetaData
{
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
}