using Models.Librarys;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Repositories.Interfaces
{
    // Repository for library documents
    public interface ILibraryRepository
    {
        // Add a new library record
        Task AddLibraryAsync(Library library);

        // Get all library records
        Task<List<Library>> GetAllLibrariesAsync();

        // Get all library records and include contractor info
        Task<List<Library>> GetAllLibrariesWithContractorsAsync();
    }
}
