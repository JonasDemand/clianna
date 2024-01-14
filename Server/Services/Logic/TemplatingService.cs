using System.Globalization;
using System.Text.Json;
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
        { "taxes", value => OrderTaxLabels.ContainsKey(value) ? OrderTaxLabels[value] : "" },
        { "shippingType", value => OrderShippingTypeLabels.ContainsKey(value) ? OrderShippingTypeLabels[value] : "" },
        { "type", value => OrderTypeLabels.ContainsKey(value) ? OrderTypeLabels[value] : "" },
        {
            "salutation",
            value => SalutationLabels.ContainsKey((ECustomerSalutation)value)
                ? SalutationLabels[(ECustomerSalutation)value]
                : ""
        },
        { "incrementalId", value => value?.ToString().PadLeft(4, '0') ?? "" }
    };

    private static readonly Dictionary<string, Func<string, dynamic, List<ITemplatingService.Replacement>>>
        CustomKeyActions = new()
        {
            {
                "taxes",
                (prefix, obj) =>
                {
                    var results = new List<ITemplatingService.Replacement>();
                    results.Add(new ITemplatingService.Replacement
                    {
                        ReplaceTemplate = $"{GetReplaceTemplate(prefix, "taxes")}}}",
                        ReplaceValue = GetLabel("taxes", obj)
                    });

                    var tax = (EOrderTax)obj;
                    var taxRate = tax == EOrderTax.Seven ? 0.07m : 0.19m;
                    var taxShare = (decimal)obj.price / (1 + taxRate) * taxRate;
                    results.Add(new ITemplatingService.Replacement
                    {
                        ReplaceTemplate = $"{GetReplaceTemplate(prefix, "taxShare")}}}",
                        ReplaceValue = GetLabel("taxShare", taxShare)
                    });

                    var netPrice = (decimal)obj.price - taxShare;
                    results.Add(new ITemplatingService.Replacement
                    {
                        ReplaceTemplate = $"{GetReplaceTemplate(prefix, "netPrice")}}}",
                        ReplaceValue = GetLabel("netPrice", netPrice)
                    });

                    return results;
                }
            }
        };

    public IEnumerable<ITemplatingService.Replacement> ReplaceTextFromObject(object obj)
    {
        return ReplaceTextFromObject(JsonSerializer.Deserialize<object>(JsonSerializer.Serialize(obj)), "");
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
            decimal decimalValue => decimalValue.ToString("0.00").Replace('.', ','),
            IFormattable formattableValue => formattableValue.ToString(null, CultureInfo.InvariantCulture),
            _ => value
        };
    }

    private IEnumerable<ITemplatingService.Replacement> ReplaceTextFromObject(object obj, string prefix)
    {
        var results = new List<ITemplatingService.Replacement>();
        foreach (var property in obj.GetType().GetProperties())
        {
            var key = property.Name;
            var value = property.GetValue(obj, null);

            var replaceTemplate = GetReplaceTemplate(prefix, key);

            if (value is Array arrayValue)
            {
                for (var i = 0; i < arrayValue.Length; i++)
                    results.AddRange(ReplaceTextFromObject(arrayValue.GetValue(i), $"{replaceTemplate}[{i}]"));
                continue;
            }

            if (value != null && !value?.GetType().IsPrimitive && value is not DateTime && value is not string)
            {
                results.AddRange(ReplaceTextFromObject(value, replaceTemplate));
                continue;
            }

            if (CustomKeyActions.ContainsKey(key))
                results.AddRange(CustomKeyActions[key](replaceTemplate, obj));
            else
                results.Add(new ITemplatingService.Replacement
                {
                    ReplaceTemplate = $"{replaceTemplate}}}",
                    ReplaceValue = GetLabel(key, value)
                });
        }

        return results;
    }
}