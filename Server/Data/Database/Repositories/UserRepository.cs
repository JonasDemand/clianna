using AutoMapper;
using Data.Models.Entities;

namespace Data.Database.Repositories;

public class UserRepository(CliannaDbContext dbContext, IMapper mapper)
    : GenericDbRepository<User>(dbContext, mapper), IUserRepository;