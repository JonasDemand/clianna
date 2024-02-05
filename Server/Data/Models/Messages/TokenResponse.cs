namespace Data.Models.Messages;

public class TokenResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public DateTime AccessTokenExpireDate { get; set; }
    public DateTime RefreshTokenExpireDate { get; set; }
}