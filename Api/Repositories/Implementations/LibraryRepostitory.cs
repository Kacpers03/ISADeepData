using Api.Data;
using Models.Librarys;
using Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories.Implementations
{
    // Repository for library document data
    public class LibraryRepository : ILibraryRepository
    {
        private readonly MyDbContext _context;

        // Constructor: set up database context
        public LibraryRepository(MyDbContext context)
        {
            _context = context;
        }

        // Add a new library record to the database
        public async Task AddLibraryAsync(Library library)
        {
            _context.Libraries.Add(library);
            await _context.SaveChangesAsync();
        }

        // Get all library records, include contractor info if needed
        public async Task<List<Library>> GetAllLibrariesAsync()
        {
            return await _context.Libraries
                .Include(l => l.Contractor) // load related contractor data
                .ToListAsync();
        }

        // Get all library records with their contractors always loaded
        public async Task<List<Library>> GetAllLibrariesWithContractorsAsync()
        {
            return await _context.Libraries
                .Include(l => l.Contractor) // load contractor navigation property
                .ToListAsync();
        }

    }
}
