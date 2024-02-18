using System.ComponentModel;

namespace Data.Models.Enums;

public enum ETemplateType
{
    [Description("Kein")] None,
    [Description("Auftrag")] Order,
    [Description("Kunde")] Customer
}