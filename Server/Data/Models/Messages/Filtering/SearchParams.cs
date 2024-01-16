namespace Data.Models.Messages.Filtering;

public class SearchParams : PaginationParams
{
    public string? ColumnSorting { get; set; }
    public string? SearchTerm { get; set; }
    public string? ColumnFilters { get; set; }
}