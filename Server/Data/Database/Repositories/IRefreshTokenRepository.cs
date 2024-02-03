using Data.Models.Entities;

namespace Data.Database.Repositories;

public interface IRefreshTokenRepository : IGenericRepository<RefreshToken>
{
    public Task<RefreshToken> Get(string userId, string token);
}