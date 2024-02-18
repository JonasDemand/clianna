using Data.Models.Enums;

namespace Data.Models.Messages;

public class UpsertOrderRequest
{
    public bool Pending { get; set; }
    public EOrderShippingType? ShippingType { get; set; }
    public string? Comment { get; set; }
    public double? Price { get; set; }
    public EOrderTax? Taxes { get; set; }
    public DateTime? DueDate { get; set; }
    public EOrderType? Type { get; set; }
    public string? Brand { get; set; }
    public string? Article { get; set; }
    public string? Color { get; set; }
    public string? Dealer { get; set; }
    public double? Size { get; set; }
    public string? Name { get; set; }

    public string? Customer { get; set; }
    public IEnumerable<string>? Documents { get; set; }
    public IEnumerable<string>? Messages { get; set; }
}