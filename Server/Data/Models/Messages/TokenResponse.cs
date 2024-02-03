using Data.Models.Services;

namespace Data.Models.Messages;

public class TokenResponse : UserSession
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
}