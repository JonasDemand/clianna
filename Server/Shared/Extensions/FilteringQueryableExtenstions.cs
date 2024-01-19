using System.Linq.Expressions;
using Data.Models.Messages.Filtering;
using OnixLabs.Core.Linq;

namespace Shared.Extensions;

public static class FilteringQueryableExtenstions
{
    public static IQueryable<T> ApplyFilters<T>(this IQueryable<T> query, IEnumerable<ColumnFilter> columnFilters,
        string? searchTerm)
        where T : class
    {
        Expression<Func<T, bool>>? filters;
        var parameter = Expression.Parameter(typeof(T), typeof(T).Name);
        Expression? filterExpression = null;

        try
        {
            if (columnFilters.IsEmpty()) throw new Exception("columnFilters are empty");
            Expression? columnFilterExpression = null;
            foreach (var filter in columnFilters)
            {
                var property = Expression.Property(parameter, filter.Name);
                Expression comparison;

                if (property.Type == typeof(string))
                {
                    var constant = Expression.Constant(filter.Value);
                    comparison = Expression.Call(property, "Contains", Type.EmptyTypes, constant);
                }
                else if (property.Type == typeof(double))
                {
                    var constant = Expression.Constant(Convert.ToDouble(filter.Value));
                    comparison = Expression.Equal(property, constant);
                }
                else if (property.Type == typeof(bool))
                {
                    var constant = Expression.Constant(Convert.ToBoolean(filter.Value));
                    comparison = Expression.Equal(property, constant);
                }
                else if (property.Type == typeof(int))
                {
                    var constant = Expression.Constant(Convert.ToInt32(filter.Value));
                    comparison = Expression.Equal(property, constant);
                }
                else
                {
                    continue;
                }

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
            if (string.IsNullOrEmpty(searchTerm)) throw new Exception("searchTerm is empty");
            Expression? searchTermExpression = null;
            foreach (var prop in typeof(T).GetProperties())
            {
                Expression comparison;
                var property = Expression.Property(parameter, prop);

                if (property.Type == typeof(string))
                {
                    var constant = Expression.Constant(searchTerm);
                    comparison = Expression.Call(property, "Contains", Type.EmptyTypes, constant);
                }
                else if (property.Type == typeof(double))
                {
                    var constant = Expression.Constant(Convert.ToDouble(searchTerm));
                    comparison = Expression.Equal(property, constant);
                }
                else if (property.Type == typeof(int))
                {
                    var constant = Expression.Constant(Convert.ToInt32(searchTerm));
                    comparison = Expression.Equal(property, constant);
                }
                else
                {
                    continue;
                }

                searchTermExpression = searchTermExpression == null
                    ? comparison
                    : Expression.OrElse(comparison,searchTermExpression);
                
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
}