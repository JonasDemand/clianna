using Data.Models.Entities;
using Data.Models.Messages;
using Data.Models.Services;

namespace Services.Entities;

public interface IUserService : IBaseEntityService<User, UpsertUserRequest>
{
    public Task<UserSession?> Authenticate(string email, string password);
    public Task<User> UpdateProfile(string id, UpsertUserRequest user);
    public Task<UserSession> GetSession(string id);
}