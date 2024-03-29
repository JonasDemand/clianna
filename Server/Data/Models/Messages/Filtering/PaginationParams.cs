namespace Data.Models.Messages.Filtering;

public class PaginationParams
{
    private const int MaxPageSize = 1000; //TODO: reduce later
    private int _pageSize = 100;
    public int PageNumber { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }
}