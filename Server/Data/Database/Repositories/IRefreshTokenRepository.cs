using Data.Models.Entities;

namespace Data.Database.Repositories;

public interface IRefreshTokenRepository : IGenericRepository<RefreshToken>
{
    public Task<RefreshToken> GetValidByUserIdAndToken(string userId, string token);

    public Task DeleteInvalid();
}