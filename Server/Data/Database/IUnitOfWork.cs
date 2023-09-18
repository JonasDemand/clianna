

using Data.Database.Repositories;

namespace Data.Database
{
	public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }

        int Save();
    }
}

