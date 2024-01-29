using System.ComponentModel;

namespace Data.Models.Enums;

public enum EOrderType
{
    [Description("Einlagen")] Einlagen,
    [Description("Einlagenarbeiten")] Einlagenarbeiten,
    [Description("Abrolloptimierung")] Abrolloptimierung,
    [Description("Schuharbeiten")] Schuharbeiten,
    [Description("Maßschuhleisten")] Massschuhleisten,
    [Description("Maßschuhe")] Massschuhe,
    [Description("Schuhbestellung")] Schuhbestellung,
    [Description("Sonstiges")] Miscellaneous
}