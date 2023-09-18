namespace Services;
using Data.Models.Services;

public interface IUserService
{
    public UserSession? Authenticate(string email, string password);
}
