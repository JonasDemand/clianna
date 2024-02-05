using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;
using Data.Models.Misc;
using Data.Models.Services;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Services.Entities;

public class UserService(
    IOptions<AppSettings> appSettings,
    IUserRepository userRepository,
    IMapper mapper,
    IRefreshTokenRepository refreshTokenRepository)
    : BaseEntityService<User, UpsertUserRequest>(userRepository, mapper), IUserService
{
    private const int KeySize = 128;
    private const int Iterations = 350000;

    private readonly AppSettings _appSettings = appSettings.Value;
    private readonly HashAlgorithmName _hashAlgorithm = HashAlgorithmName.SHA512;


    public async Task<TokenResponse?> Authenticate(string email, string password)
    {
        var user = await userRepository.GetFirstOrDefault(x => x.Email == email);
        if (user is { Enabled: false }) return null;

        if (user == null)
        {
            await userRepository.Add(new User
            {
                Enabled = false,
                Email = email,
                Password = HashPassword(password, out var salt),
                Salt = salt
            });

            return null;
        }

        if (!VerifyPassword(password, user.Password, user.Salt)) return null;

        var accessToken = GenerateJwtToken(user, out var expireDate);
        var refreshToken = await refreshTokenRepository.Add(new RefreshToken
        {
            Token = GenerateRefreshToken(), User = user
        });

        return new TokenResponse
        {
            AccessToken = accessToken,
            AccessTokenExpireDate = expireDate,
            RefreshToken = refreshToken.Token,
            RefreshTokenExpireDate = refreshToken.ExpireDate
        };
    }

    public async Task<TokenResponse?> Refresh(UserSession oldSession, string refreshToken)
    {
        var newRefreshToken = await refreshTokenRepository.GetValidByUserIdAndToken(oldSession.Id, refreshToken);
        if (newRefreshToken == null) return null;

        newRefreshToken.Token = GenerateRefreshToken();
        newRefreshToken.ExpireDate = DateTime.Now.AddDays(1);
        await refreshTokenRepository.SaveChanges();
        var newAccessToken = GenerateJwtToken(newRefreshToken.User, out var expireDate);

        return new TokenResponse
        {
            AccessToken = newAccessToken,
            AccessTokenExpireDate = expireDate,
            RefreshToken = newRefreshToken.Token,
            RefreshTokenExpireDate = newRefreshToken.ExpireDate
        };
    }

    public async Task<User> UpdateProfile(string id, UpsertUserRequest user)
    {
        var entry = await userRepository.Get(id);
        entry.Email = user.Email;
        if (!string.IsNullOrEmpty(user.Password))
        {
            entry.Password = HashPassword(user.Password, out var salt);
            entry.Salt = salt;
        }

        return await userRepository.Update(entry);
    }

    // helper methods

    private string GenerateJwtToken(User user, out DateTime expireDate)
    {
        expireDate = DateTime.UtcNow.AddSeconds(15);
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
                { new Claim("id", user.Id), new Claim("email", user.Email) }),
            Expires = expireDate,
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string HashPassword(string password, out string salt)
    {
        var byteSalt = RandomNumberGenerator.GetBytes(KeySize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            byteSalt,
            Iterations,
            _hashAlgorithm,
            KeySize);
        salt = Convert.ToHexString(byteSalt);
        return Convert.ToHexString(hash);
    }

    private bool VerifyPassword(string password, string hash, string salt)
    {
        var hashToCompare =
            Rfc2898DeriveBytes.Pbkdf2(password, Convert.FromHexString(salt), Iterations, _hashAlgorithm, KeySize);
        return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hash));
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}