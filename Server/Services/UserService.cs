using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Data.Database.Repositories;
using Data.Models.Entities;
using Data.Models.Messages;
using Data.Models.Services;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Models.Misc;

namespace Services;

public class UserService : BaseEntityService<User, UpsertUser>, IUserService
{
    private const int keySize = 128;
    private const int iterations = 350000;

    private readonly AppSettings _appSettings;
    private readonly IUserRepository _userRepository;
    private readonly HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;

    public UserService(IOptions<AppSettings> appSettings, IUserRepository userRepository, IMapper mapper) : base(
        userRepository, mapper)
    {
        _appSettings = appSettings.Value;
        _userRepository = userRepository;
    }


    public async Task<UserSession?> Authenticate(string email, string password)
    {
        var user = await _userRepository.GetFirstOrDefault(x => x.Email == email);
        if (user is { Enabled: false }) return null;

        if (user == null)
        {
            await _userRepository.Add(new User
            {
                Enabled = false,
                Email = email,
                Password = HashPasword(password, out var salt),
                Salt = salt
            });

            return null;
        }

        if (!VerifyPassword(password, user.Password, user.Salt)) return null;

        var token = GenerateJwtToken(user);

        return new UserSession
        {
            Id = user.Id,
            Email = user.Email,
            Token = token
        };
    }

    // helper methods

    private string GenerateJwtToken(User user)
    {
        // generate token that is valid for 7 days
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
                { new Claim("id", user.Id), new Claim("email", user.Email) }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string HashPasword(string password, out string salt)
    {
        var byteSalt = RandomNumberGenerator.GetBytes(keySize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            byteSalt,
            iterations,
            hashAlgorithm,
            keySize);
        salt = Convert.ToHexString(byteSalt);
        return Convert.ToHexString(hash);
    }

    private bool VerifyPassword(string password, string hash, string salt)
    {
        var hashToCompare =
            Rfc2898DeriveBytes.Pbkdf2(password, Convert.FromHexString(salt), iterations, hashAlgorithm, keySize);
        return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hash));
    }
}