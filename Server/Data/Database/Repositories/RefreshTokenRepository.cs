using System.Linq.Expressions;
using AutoMapper;
using Data.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Database.Repositories;

public class RefreshTokenRepository(CliannaDbContext dbContext, IMapper mapper)
    : GenericDbRepository<RefreshToken>(dbContext, mapper,
        new List<Expression<Func<RefreshToken, object>>> { e => e.User }), IRefreshTokenRepository
{
    public async Task<RefreshToken> GetValidByUserIdAndToken(string userId, string token)
    {
        return await Query.FirstOrDefaultAsync(x =>
            x.User.Id.Equals(userId) && x.Token.Equals(token) && x.ExpireDate >= DateTime.UtcNow.AddDays(-1));
    }

    public async Task DeleteInvalid()
    {
        await Delete(x => x.ExpireDate < DateTime.UtcNow);
    }
}