using Data.Models.Entities;
using Data.Models.Messages;
using Data.Models.Services;

namespace Services;

public interface IUserService : IBaseEntityService<User, UpsertUser>
{
    public Task<UserSession?> Authenticate(string email, string password);
}