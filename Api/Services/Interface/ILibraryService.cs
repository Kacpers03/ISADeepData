using DTOs.Library_Dto;
using Microsoft.AspNetCore.Http;

namespace Api.Services.Interfaces
{
    public interface ILibraryService
    {
        Task<string> UploadFileAsync(IFormFile file, LibraryDto dto);
        Task<List<LibraryDto>> GetAllAsync();
    }
}
