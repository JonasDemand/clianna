using System.Text.Json.Serialization;
using Api.Config;
using Api.Middlewares;
using Data.Database;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;
using Data.Models.Messages.Filtering;
using Data.Models.Misc;
using Data.Models.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Services.Api;
using Services.Entities;
using Services.ExternalApis;
using Services.Logic;
using Services.Maintenance;

// Needed for google apis to work with .net8
AppContext.SetSwitch("System.Net.SocketsHttpHandler.Http3Support", false);

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddDbContext<CliannaDbContext>();
builder.Services.AddAutoMapper(cfg =>
{
    cfg.CreateMap<UpsertUserRequest, User>();
    cfg.CreateMap<User, UserSession>();
    cfg.CreateMap<UpsertCustomerRequest, Customer>().ForMember(x => x.Documents, opts => opts.Ignore())
        .ForMember(x => x.Orders, opts => opts.Ignore());
    cfg.CreateMap<UpsertDocumentReqeust, Document>().ForMember(x => x.Order, opts => opts.Ignore())
        .ForMember(x => x.Customer, opts => opts.Ignore());
    cfg.CreateMap<UpsertOrderRequest, Order>().ForMember(x => x.Documents, opts => opts.Ignore())
        .ForMember(x => x.Customer, opts => opts.Ignore());
    cfg.CreateMap<CopyDocumentRequest, Document>().ForMember(x => x.Order, opts => opts.Ignore())
        .ForMember(x => x.Customer, opts => opts.Ignore());
});

builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

builder.Services.AddSingleton<IResponseFactory, ResponseFactory>();
builder.Services.AddSingleton<IGoogleService, GoogleService>();
builder.Services.AddSingleton<ITemplatingService, TemplatingService>();
builder.Services.AddScoped<IMigrationService, MigrationService>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IDocumentService, DocumentService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddMvc();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Clianna API"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description =
            "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });

    c.DocumentFilter<CustomModelDocumentFilter<ColumnFilter>>();
    c.DocumentFilter<CustomModelDocumentFilter<ColumnSorting>>();
});

builder.Services.AddCors();

var app = builder.Build();

//Migrate DB
using (var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
{
    var context = serviceScope.ServiceProvider.GetService<CliannaDbContext>();
    context?.Database.Migrate();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<JwtMiddleware>();

app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.MapControllers();

app.Run();