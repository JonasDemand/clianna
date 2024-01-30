using System.ComponentModel;

namespace Data.Models.Enums;

public enum ECustomerSalutation
{
    [Description("Herr")] Mr,
    [Description("Frau")] Mrs,
    [Description("Divers")] Diverse,
    [Description("Firma")] Company
}