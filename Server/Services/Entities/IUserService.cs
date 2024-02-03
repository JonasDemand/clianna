using Data.Models.Entities;
using Data.Models.Messages;

namespace Services.Entities;

public interface IUserService : IBaseEntityService<User, UpsertUserRequest>
{
    public Task<TokenResponse?> Authenticate(string email, string password);
    public Task<TokenResponse?> Refresh(string oldJwt, string refreshToken);
    public Task<User> UpdateProfile(string id, UpsertUserRequest user);
}