using Azure.Storage.Blobs;
using System.IO;
using DTOs.Library_Dto;
using Microsoft.AspNetCore.Http;
using Models.Librarys;
using Api.Services.Interfaces;
using Api.Data;
using Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.Implementations
{
    public class LibraryService : ILibraryService
    {
        private readonly ILibraryRepository _libraryRepository;
        private readonly MyDbContext _context;
        private readonly string _connectionString;
        private readonly string _containerName;

        public LibraryService(ILibraryRepository libraryRepository, MyDbContext context, IConfiguration configuration)
        {
            _libraryRepository = libraryRepository;
            _context = context;
            _connectionString = "DefaultEndpointsProtocol=https;AccountName=isalibraryfiles;AccountKey=C9ws6y40U+9e1TERxRbaojY5F6yyWuQrbF2eGLLGgnPOp7IuFewl4BzgKCzPwCW0BZD+8YIrApWH+AStog45Dw==;EndpointSuffix=core.windows.net";
            _containerName = "files";
        }

        public async Task<string> UploadFileAsync(IFormFile file, LibraryDto dto) //Function for fetching files based on blob url
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is missing.");

            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);
            await containerClient.CreateIfNotExistsAsync(); 

            var blobClient = containerClient.GetBlobClient(file.FileName); //Fetching

            using (var stream = file.OpenReadStream()) 
            {
                await blobClient.UploadAsync(stream, overwrite: true);
            }

            var libraryEntity = new Library //Uses DTO to get the entry in the database
            {
                ContractorId = dto.ContractorId,
                Theme = dto.Theme,
                FileName = file.FileName,
                Title = dto.Title,
                Description = dto.Description,
                Year = dto.Year,
                Country = dto.Country,
                SubmissionDate = dto.SubmissionDate,
                IsConfidential = dto.IsConfidential
            };

            await _libraryRepository.AddLibraryAsync(libraryEntity); //Adds into the DB

            return file.FileName; //returns filename
        }

        public async Task<List<LibraryDto>> GetAllAsync() //Function for fetching the list of libraryDTOs
        {
            //Ensure Contractor is included
            var items = await _context.Libraries
                .Include(l => l.Contractor)
                .ToListAsync();

            return items.Select(l => new LibraryDto //Selects based on ID
            {
                LibraryId = l.LibraryId,
                ContractorId = l.ContractorId,
                Contractor = l.Contractor.ContractorName,
                Theme = l.Theme,
                FileName = Path.GetFileName(l.FileName),
                Title = l.Title,
                Description = l.Description,
                Year = l.Year,
                Country = l.Country,
                SubmissionDate = l.SubmissionDate,
                IsConfidential = l.IsConfidential
            }).ToList();
        }

        public async Task<List<string>> GetDistinctContractors() //Getting the contractors based on ID
        {
            var libraries = await _libraryRepository.GetAllLibrariesWithContractorsAsync(); //Uses repository implementation

            return libraries
                .Where(l => l.Contractor != null && !string.IsNullOrEmpty(l.Contractor.ContractorName))
                .Select(l => l.Contractor.ContractorName)
                .Distinct()
                .OrderBy(name => name)
                .ToList();
        }

        public async Task<List<string>> GetDistinctThemes() //Getting the themes based on filtered theme
        {
            var libraries = await _libraryRepository.GetAllLibrariesAsync(); //Uses repository

            return libraries
                .Where(l => !string.IsNullOrEmpty(l.Theme))
                .Select(l => l.Theme)
                .Distinct()
                .OrderBy(theme => theme)
                .ToList();
        }
    }
}
