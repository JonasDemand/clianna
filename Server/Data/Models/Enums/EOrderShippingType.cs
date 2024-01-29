using System.ComponentModel;

namespace Data.Models.Enums;

public enum EOrderShippingType
{
    [Description("Versand")] Send,
    [Description("Abholung")] Collect,
    [Description("Hausbesuch")] Visit
}