using Models.Librarys;

namespace Api.Repositories.Interfaces
{
    public interface ILibraryRepository
    {
        Task AddLibraryAsync(Library library);
        Task<List<Library>> GetAllLibrariesAsync();
        Task<List<Library>> GetAllLibrariesWithContractorsAsync();
    }
}
