using System.Globalization;
using System.Reflection;
using Data.Models.Entities;
using Data.Models.Enums;

namespace Services.Logic;

public class TemplatingService : ITemplatingService
{
    private static readonly Dictionary<ECustomerSalutation, string> SalutationLabels = new()
    {
        { ECustomerSalutation.Mr, "Sehr geehrter Herr" },
        { ECustomerSalutation.Mrs, "Sehr geehrte Frau" },
        { ECustomerSalutation.Diverse, "Sehr geehrte*r Herr/Frau" },
        { ECustomerSalutation.Company, "Sehr geehrte Damen und Herren" }
    };

    private static readonly Dictionary<EOrderTax, string> OrderTaxLabels = new()
    {
        { EOrderTax.Nineteen, "19%" },
        { EOrderTax.Seven, "7%" }
    };

    private static readonly Dictionary<EOrderType, string> OrderTypeLabels = new()
    {
        { EOrderType.Einlagen, "Einlagen" },
        { EOrderType.Einlagenarbeiten, "Einlagenarbeiten" },
        { EOrderType.Abrolloptimierung, "Abrolloptimierung" },
        { EOrderType.Schuharbeiten, "Schuharbeiten" },
        { EOrderType.Massschuhleisten, "Maßschuhleisten" },
        { EOrderType.Massschuhe, "Maßschuhe" },
        { EOrderType.Schuhbestellung, "Schuhbestellung" },
        { EOrderType.Miscellaneous, "Sonstiges" }
    };

    private static readonly Dictionary<EOrderShippingType, string> OrderShippingTypeLabels = new()
    {
        { EOrderShippingType.Send, "Versand" },
        { EOrderShippingType.Collect, "Abholung" },
        { EOrderShippingType.Visit, "Hausbesuch" }
    };

    private static readonly Dictionary<string, Func<dynamic, string>> CustomLabels = new()
    {
        { "Taxes", value => OrderTaxLabels.ContainsKey(value) ? OrderTaxLabels[value] : "" },
        { "ShippingType", value => OrderShippingTypeLabels.ContainsKey(value) ? OrderShippingTypeLabels[value] : "" },
        { "Type", value => OrderTypeLabels.ContainsKey(value) ? OrderTypeLabels[value] : "" },
        {
            "Salutation",
            value => SalutationLabels.ContainsKey((ECustomerSalutation)value)
                ? SalutationLabels[(ECustomerSalutation)value]
                : ""
        },
        { "IncrementalId", value => value?.ToString().PadLeft(4, '0') ?? "" }
    };

    private static readonly Dictionary<string, Func<string, dynamic, List<ITemplatingService.Replacement>>>
        CustomKeyActions = new()
        {
            {
                "Taxes",
                (prefix, obj) =>
                {
                    EOrderTax taxes = obj.Taxes;
                    double price = obj.Price;
                    var taxRate = taxes == EOrderTax.Seven ? 0.07 : 0.19;
                    var taxShare = price / (1 + taxRate) * taxRate;
                    var netPrice = price - taxShare;
                    return new List<ITemplatingService.Replacement>
                    {
                        new()
                        {
                            ReplaceTemplate = $"{GetReplaceTemplate(prefix, "Taxes")}}}}}",
                            ReplaceValue = GetLabel("Taxes", taxes)
                        },
                        new()
                        {
                            ReplaceTemplate = $"{GetReplaceTemplate(prefix, "TaxShare")}}}}}",
                            ReplaceValue = GetLabel("TaxShare", taxShare)
                        },
                        new()
                        {
                            ReplaceTemplate = $"{GetReplaceTemplate(prefix, "NetPrice")}}}}}",
                            ReplaceValue = GetLabel("NetPrice", netPrice)
                        }
                    };
                }
            }
        };

    public IEnumerable<ITemplatingService.Replacement> ReplaceTextFromObject(dynamic obj, string prefix = "",
        int depth = 0)
    {
        var results = new List<ITemplatingService.Replacement>();
        PropertyInfo[] properties;

        if (depth > 2) return results;

        switch (obj)
        {
            case Document:
                properties = typeof(Document).GetProperties();
                break;
            case Order:
                properties = typeof(Order).GetProperties();
                break;
            case Customer:
                properties = typeof(Customer).GetProperties();
                break;
            default:
                return results;
        }

        foreach (var property in properties)
        {
            var key = property.Name;
            var value = property.GetValue(obj, null);

            var replaceTemplate = GetReplaceTemplate(prefix, key);

            if (value is IEnumerable<dynamic> listValue)
            {
                for (var i = 0; i < listValue.Count(); i++)
                    results.AddRange(
                        ReplaceTextFromObject(listValue.ElementAt(i), $"{replaceTemplate}[{i}]", depth + 1));
                continue;
            }

            if (value != null && value is IEntity)
            {
                results.AddRange(ReplaceTextFromObject(value, replaceTemplate, depth + 1));
                continue;
            }

            if (CustomKeyActions.TryGetValue(key, out var action))
                results.AddRange(action(prefix, obj));
            else
                results.Add(new ITemplatingService.Replacement
                {
                    ReplaceTemplate = $"{replaceTemplate}}}}}",
                    ReplaceValue = GetLabel(key, value)
                });
        }

        return results;
    }

    private static string GetReplaceTemplate(string prefix, string key)
    {
        return $"{(!prefix.StartsWith("{{") ? "{{" : "")}{prefix}{(string.IsNullOrEmpty(prefix) ? "" : ".")}{key}";
    }

    private static string GetLabel(string key, dynamic value)
    {
        if (value == null) return "";
        if (CustomLabels.TryGetValue(key, out var labelFunc)) return labelFunc(value);
        return value switch
        {
            bool booleanValue => booleanValue ? "Ja" : "Nein",
            DateTime dateValue => dateValue.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture),
            double doubleValue => doubleValue.ToString("0.00").Replace('.', ','),
            IFormattable formattableValue => formattableValue.ToString(null, CultureInfo.InvariantCulture),
            _ => value
        };
    }
}