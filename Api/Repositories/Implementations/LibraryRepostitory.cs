using Api.Data;
using Models.Librarys;
using Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    public class LibraryRepository : ILibraryRepository
    {
        private readonly MyDbContext _context;

        public LibraryRepository(MyDbContext context)
        {
            _context = context;
        }

        public async Task AddLibraryAsync(Library library)
        {
            _context.Libraries.Add(library);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Library>> GetAllLibrariesAsync()
        {
            return await _context.Libraries
                .Include(l => l.Contractor) // if needed
                .ToListAsync();
        }

        public async Task<List<Library>> GetAllLibrariesWithContractorsAsync()
        {
            return await _context.Libraries
                .Include(l => l.Contractor)
                .ToListAsync();
        }

    }
}
