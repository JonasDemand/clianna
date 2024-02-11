using System.ComponentModel;
using System.Reflection;

namespace Shared.Extensions;

public static class EnumExtensions
{
    public static string GetDescription(this Enum enumValue)
    {
        return enumValue.GetType()
            .GetMember(enumValue.ToString())
            .First()
            .GetCustomAttribute<DescriptionAttribute>()?
            .Description ?? string.Empty;
    }
}