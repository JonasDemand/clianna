using System.Globalization;
using Data.Models.Entities;
using Data.Models.Enums;
using Shared.Extensions;

namespace Services.Logic;

public class TemplatingService : ITemplatingService
{
    private static readonly Dictionary<string, Func<dynamic, string>> CustomLabels = new()
    {
        { "IncrementalId", value => value?.ToString().PadLeft(4, '0') ?? string.Empty }
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

        if (depth > 2) return results;

        foreach (var property in obj.GetType().GetProperties())
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

            if (CustomKeyActions.TryGetValue(key,
                    out Func<string, dynamic, List<ITemplatingService.Replacement>>? action))
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
        return
            $"{(!prefix.StartsWith("{{") ? "{{" : string.Empty)}{prefix}{(string.IsNullOrEmpty(prefix) ? string.Empty : ".")}{key}";
    }

    private static string GetLabel(string key, dynamic value)
    {
        if (value == null) return string.Empty;
        if (CustomLabels.TryGetValue(key, out var labelFunc)) return labelFunc(value);
        return value switch
        {
            bool booleanValue => booleanValue ? "Ja" : "Nein",
            DateTime dateValue => dateValue.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture),
            double doubleValue => doubleValue.ToString("0.00").Replace('.', ','),
            Enum enumValue => enumValue.GetDescription(),
            IFormattable formattableValue => formattableValue.ToString(null, CultureInfo.InvariantCulture),
            _ => value
        };
    }
}