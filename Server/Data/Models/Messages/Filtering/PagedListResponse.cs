namespace Data.Models.Messages.Filtering;

public class PagedListResponse<T>
{
    public PaginationMetaData MetaData { get; set; }
    public IEnumerable<T> List { get; set; }
    
    public PagedListResponse(IEnumerable<T> items, int count, int pageNumber, int pageSize)
    {
        MetaData = new PaginationMetaData
        {
            TotalCount = count,
            PageSize = pageSize,
            CurrentPage = pageNumber,
            TotalPages = (int)Math.Ceiling(count / (double)pageSize)
        };
        List = items;
    }

}

public class PaginationMetaData
{
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
}