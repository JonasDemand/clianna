using System;
using Data.Database.Repositories;

namespace Data.Database
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly CliannaDbContext _dbContext;
        public IUserRepository Users { get; }

        public UnitOfWork(CliannaDbContext dbContext,
                            IUserRepository userRepository)
        {
            _dbContext = dbContext;
            Users = userRepository;
        }

        public int Save()
        {
            return _dbContext.SaveChanges();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                _dbContext.Dispose();
            }
        }

    }
}

