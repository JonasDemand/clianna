using System.Linq.Expressions;
using Data.Models.Messages.Filtering;

namespace Shared.Extensions;

public static class FilteringQueryableExtensions
{
    public static IQueryable<T> ApplyFilters<T>(this IQueryable<T> query, IEnumerable<ColumnFilter> columnFilters,
        string? searchTerm)
        where T : class
    {
        Expression<Func<T, bool>>? filters;
        var parameter = Expression.Parameter(typeof(T));
        Expression? filterExpression = null;

        try
        {
            if (!columnFilters.Any()) throw new Exception("columnFilters are empty");
            Expression? columnFilterExpression = null;
            foreach (var filter in columnFilters)
            {
                var property = Expression.Property(parameter, filter.Name);
                var comparison = GenerateComparison(property, filter.Value.Trim());

                if (comparison == null) continue;

                columnFilterExpression = columnFilterExpression == null
                    ? comparison
                    : Expression.AndAlso(columnFilterExpression, comparison);
            }

            filterExpression = columnFilterExpression;
        }
        catch
        {
            // ignored
        }

        try
        {
            var processedSearchTerm = searchTerm.Split(" ").Select(s => s.Trim()).Where(s => !string.IsNullOrEmpty(s));
            if (!processedSearchTerm.Any()) throw new Exception("searchTerm is empty");
            Expression? searchTermExpression = null;
            foreach (var prop in typeof(T).GetProperties())
            {
                var property = Expression.Property(parameter, prop);
                var comparison = GenerateComparison(property, processedSearchTerm);

                if (comparison == null) continue;

                searchTermExpression = searchTermExpression == null
                    ? comparison
                    : Expression.OrElse(comparison, searchTermExpression);
            }

            filterExpression = filterExpression == null
                ? searchTermExpression
                : Expression.AndAlso(filterExpression, searchTermExpression);
        }
        catch
        {
            // ignored
        }

        try
        {
            filters = Expression.Lambda<Func<T, bool>>(filterExpression, parameter);
        }
        catch
        {
            return query;
        }

        return query.Where(filters);
    }

    public static IQueryable<T> OrderBy<T>(this IQueryable<T> query, IEnumerable<ColumnSorting> columnSorting)
    {
        var expression = query.Expression;
        var type = typeof(T);
        var parameter = Expression.Parameter(type, typeof(T).Name);

        foreach (var cs in columnSorting.Select((x, i) => new { Value = x, Index = i }))
        {
            var property = type.GetProperty(cs.Value.Name);
            var propertyAccess = Expression.MakeMemberAccess(parameter, property);
            var orderByExp = Expression.Lambda(propertyAccess, parameter);
            expression = Expression.Call(typeof(Queryable),
                cs.Index > 0 ? cs.Value.Desc ? "ThenByDescending" : "ThenBy" :
                cs.Value.Desc ? "OrderByDescending" : "OrderBy",
                new[] { type, property.PropertyType },
                expression, Expression.Quote(orderByExp));
        }

        return query.Provider.CreateQuery<T>(expression);
    }

    public static IQueryable<T> CustomPagination<T>(this IQueryable<T> query, int? page = 0, int pageSize = 100)
    {
        if (page != null) query = query.Skip(((int)page - 1) * pageSize);
        query = query.Take(pageSize);
        return query;
    }

    private static Expression? GenerateComparison(MemberExpression property, string searchValue)
    {
        try
        {
            var type = Nullable.GetUnderlyingType(property.Type) ??
                       property.Type ?? throw new Exception("Invalid Type");
            if (type == typeof(string))
            {
                var constant = Expression.Constant(searchValue);
                return Expression.Call(property, "Contains", Type.EmptyTypes, constant);
            }

            if (type == typeof(double))
            {
                var constant = Expression.Constant(Convert.ToDouble(searchValue));
                return Expression.Equal(property, constant);
            }

            if (type == typeof(bool))
            {
                var constant = Expression.Constant(Convert.ToBoolean(searchValue));
                return Expression.Equal(property, constant);
            }

            if (type == typeof(int))
            {
                var constant = Expression.Constant(Convert.ToInt32(searchValue));
                return Expression.Equal(property, constant);
            }

            if (type.IsEnum)
            {
                foreach (var value in Enum.GetValues(type))
                    if (!(value as Enum).GetDescription().Contains(searchValue))
                        continue;
                //TODO: implement enum filtering
                return null;
            }
        }
        catch
        {
            return null;
        }

        return null;
    }

    private static Expression? GenerateComparison(MemberExpression property, IEnumerable<string> searchValues)
    {
        Expression? filterExpression = null;
        foreach (var searchValue in searchValues)
        {
            var comparison = GenerateComparison(property, searchValue);

            if (comparison == null) continue;

            filterExpression = filterExpression == null
                ? comparison
                : Expression.OrElse(filterExpression, comparison);
        }

        return filterExpression;
    }
}