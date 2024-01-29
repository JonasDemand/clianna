using System.ComponentModel;

namespace Data.Models.Enums;

public enum ECustomerSalutation
{
    [Description("Sehr geehrter Her")] Mr,
    [Description("Sehr geehrte Frau")] Mrs,

    [Description("Sehr geehrte*r Herr/Frau")]
    Diverse,

    [Description("Sehr geehrte Damen und Herren")]
    Company
}