using System.Data;
using System.Data.Common;
using Data.Database;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Enums;
using Data.Models.Misc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Services.Maintenance;

public class MigrationService : IMigrationService
{
    private readonly AppSettings _appSettings;
    private readonly ICustomerRepository _customerRepository;
    private readonly CliannaDbContext _dbContext;
    private readonly IDocumentRepository _documentRepository;
    private readonly IOrderRepository _orderRepository;

    public MigrationService(ICustomerRepository customerRepository, IOrderRepository orderRepository,
        IDocumentRepository documentRepository, CliannaDbContext dbContext, IOptions<AppSettings> appSettings)
    {
        _appSettings = appSettings.Value;
        _orderRepository = orderRepository;
        _documentRepository = documentRepository;
        _customerRepository = customerRepository;
        _dbContext = dbContext;
    }

    public async Task MigrateLegacyDb(string dbName)
    {
        if (!_appSettings.DevMode) throw new Exception("AppSetting DevMode required for this operation");
        var connection = _dbContext.Database.GetDbConnection();
        var legacyCustomers = await ExecuteCommand(connection, $"SELECT * FROM {dbName}.Customer");
        var legacyOrders = await ExecuteCommand(connection, $"SELECT * FROM {dbName}.Order");
        var legacyDocuments = await ExecuteCommand(connection, $"SELECT * FROM {dbName}.Document");

        var transaction = await _dbContext.Database.BeginTransactionAsync();

        var customers = Enumerable.Select(legacyCustomers.AsEnumerable(), customer => new Customer
        {
            Id = ConvertFromDbVal<string>(customer["id"])!,
            FirstName = ConvertFromDbVal<string?>(customer["firstname"]),
            LastName = ConvertFromDbVal<string?>(customer["lastname"]),
            City = ConvertFromDbVal<string?>(customer["city"]),
            Comment = ConvertFromDbVal<string?>(customer["comment"]),
            Disabled = ConvertFromDbVal<bool>(customer["disabled"]),
            Email = ConvertFromDbVal<string?>(customer["email"]),
            Mobile = ConvertFromDbVal<string?>(customer["mobile"]),
            Phone = ConvertFromDbVal<string?>(customer["phone"]),
            Salutation = MapSalutation(ConvertFromDbVal<string?>(customer["phone"])),
            Street = ConvertFromDbVal<string?>(customer["street"]),
            PostalCode = ConvertFromDbVal<string?>(customer["postalcode"]),
            ShoeSize = ConvertFromDbVal<double?>(customer["shoesize"]),
            StreetNumber = ConvertFromDbVal<string?>(customer["streetnumber"]),
            WhatsApp = ConvertFromDbVal<bool?>(customer["whatsapp"])
        });
        await _customerRepository.Add(customers);

        var orders = legacyOrders.AsEnumerable().Select(async order => new Order
        {
            Id = ConvertFromDbVal<string>(order["id"])!,
            Article = ConvertFromDbVal<string?>(order["article"]),
            Comment = ConvertFromDbVal<string?>(order["comment"]),
            Brand = ConvertFromDbVal<string?>(order["brand"]),
            Color = ConvertFromDbVal<string?>(order["color"]),
            Dealer = ConvertFromDbVal<string?>(order["dealer"]),
            Name = ConvertFromDbVal<string?>(order["name"]),
            Pending = ConvertFromDbVal<bool>(order["pending"]),
            Price = ConvertFromDbVal<double?>(order["price"]),
            Size = ConvertFromDbVal<double?>(order["size"]),
            Taxes = MapTax(ConvertFromDbVal<string?>(order["taxes"])),
            Type = MapOrderType(ConvertFromDbVal<string?>(order["type"])),
            CreationDate = ConvertFromDbVal<DateTime>(order["creationDate"]),
            DueDate = ConvertFromDbVal<DateTime?>(order["dueDate"]),
            ShippingType = MapShippingType(ConvertFromDbVal<string?>(order["shippingType"])),
            Customer = await _customerRepository.Get(ConvertFromDbVal<string?>(order["customerId"]))
        }).Select(t => t.Result);
        await _orderRepository.Add(orders);

        var documents = legacyDocuments.AsEnumerable().Select(async order => new Document
        {
            Id = ConvertFromDbVal<string>(order["id"])!,
            Name = ConvertFromDbVal<string?>(order["name"]),
            CreationDate = ConvertFromDbVal<DateTime>(order["creationDate"]),
            Template = ConvertFromDbVal<bool>(order["template"]),
            GoogleId = ConvertFromDbVal<string?>(order["googleId"]),
            IncrementalId = ConvertFromDbVal<int?>(order["incrementalId"]),
            Customer = await _customerRepository.Get(ConvertFromDbVal<string?>(order["customerId"])),
            Order = await _orderRepository.Get(ConvertFromDbVal<string?>(order["orderId"]))
        }).Select(t => t.Result);
        await _documentRepository.Add(documents);


        await transaction.CommitAsync();
    }

    private static ECustomerSalutation? MapSalutation(string? salutation)
    {
        return salutation switch
        {
            "Company" => ECustomerSalutation.Company,
            "Mr" => ECustomerSalutation.Mr,
            "Mrs" => ECustomerSalutation.Mrs,
            "Diverse" => ECustomerSalutation.Diverse,
            _ => null
        };
    }

    private static EOrderTax? MapTax(string? tax)
    {
        return tax switch
        {
            "Nineteen" => EOrderTax.Nineteen,
            "Seven" => EOrderTax.Seven,
            _ => null
        };
    }

    private static EOrderType? MapOrderType(string? type)
    {
        return type switch
        {
            "Abrolloptimierung" => EOrderType.Abrolloptimierung,
            "Massschuhe" => EOrderType.Massschuhe,
            "Einlagenarbeiten" => EOrderType.Einlagenarbeiten,
            "Miscellaneous" => EOrderType.Miscellaneous,
            "Schuharbeiten" => EOrderType.Schuharbeiten,
            "Einlagen" => EOrderType.Einlagen,
            "Massschuhleisten" => EOrderType.Massschuhleisten,
            "Schuhbestellung" => EOrderType.Schuhbestellung,
            _ => null
        };
    }

    private static EOrderShippingType? MapShippingType(string? type)
    {
        return type switch
        {
            "Collect" => EOrderShippingType.Collect,
            "Visit" => EOrderShippingType.Visit,
            "Send" => EOrderShippingType.Send,
            _ => null
        };
    }

    private static T? ConvertFromDbVal<T>(object? obj)
    {
        if (obj == null || obj == DBNull.Value)
            return default; // returns the default value for the type
        return (T)obj;
    }

    private static async Task<DataTable> ExecuteCommand(DbConnection connection, string query)
    {
        var dataTable = new DataTable();
        var dbFactory = DbProviderFactories.GetFactory(connection);
        await using var cmd = dbFactory?.CreateCommand();

        if (cmd == null) return dataTable;
        cmd.Connection = connection;
        cmd.CommandType = CommandType.Text;
        cmd.CommandText = query;
        using var adapter = dbFactory?.CreateDataAdapter();

        if (adapter == null) return dataTable;
        adapter.SelectCommand = cmd;
        adapter.Fill(dataTable);

        return dataTable;
    }
}