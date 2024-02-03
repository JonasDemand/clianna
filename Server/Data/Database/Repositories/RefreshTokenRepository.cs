using AutoMapper;
using Data.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Database.Repositories;

public class RefreshTokenRepository(CliannaDbContext dbContext, IMapper mapper) : GenericDbRepository<RefreshToken>(
    dbContext,
    mapper), IRefreshTokenRepository
{
    public async Task<RefreshToken> Get(string userId, string token)
    {
        return await dbContext.RefreshTokens.FirstOrDefaultAsync(x =>
            x.User.Id.Equals(userId) && x.Token.Equals(token));
    }
}