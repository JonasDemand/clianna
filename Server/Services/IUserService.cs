namespace Services;
using Data.Models.Services;

public interface IUserService
{
    public Task<UserSession?> Authenticate(string email, string password);
}
