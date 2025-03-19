using Azure.Storage.Blobs;
using System.IO;
using DTOs.Library_Dto;
using Microsoft.AspNetCore.Http;
using Models.Librarys;
using Api.Services.Interfaces;
using Api.Data;
using Api.Repositories.Interfaces;

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

        public async Task<string> UploadFileAsync(IFormFile file, LibraryDto dto)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is missing.");

            // Connect to Azure Blob Storage
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);
            await containerClient.CreateIfNotExistsAsync();

            // Upload file using original file name
            var blobClient = containerClient.GetBlobClient(file.FileName);

            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, overwrite: true);
            }

            var libraryEntity = new Library
            {
                ContractorId = dto.ContractorId,
                Theme = dto.Theme,
                FileName = file.FileName, //  Only file name saved (e.g., "report.pdf")
                Title = dto.Title,
                Description = dto.Description,
                Year = dto.Year,
                Country = dto.Country,
                SubmissionDate = dto.SubmissionDate,
                IsConfidential = dto.IsConfidential
            };

            await _libraryRepository.AddLibraryAsync(libraryEntity);

            // Optionally return the file name (or full URL if you ever need)
            return file.FileName;
        }

        public async Task<List<LibraryDto>> GetAllAsync()
        {
            var items = await _libraryRepository.GetAllLibrariesAsync();

            return items.Select(l => new LibraryDto
            {
                LibraryId = l.LibraryId,
                ContractorId = l.ContractorId,
                Theme = l.Theme,
                FileName = Path.GetFileName(l.FileName), //  Still just the file name here
                Title = l.Title,
                Description = l.Description,
                Year = l.Year,
                Country = l.Country,
                SubmissionDate = l.SubmissionDate,
                IsConfidential = l.IsConfidential
            }).ToList();
        }

        public async Task<List<string>> GetDistinctContractors()
        {
            var libraries = await _libraryRepository.GetAllLibrariesWithContractorsAsync();

            return libraries
                .Where(l => l.Contractor != null && !string.IsNullOrEmpty(l.Contractor.ContractorName))
                .Select(l => l.Contractor.ContractorName)
                .Distinct()
                .OrderBy(name => name)
                .ToList();
        }

        public async Task<List<string>> GetDistinctThemes()
        {
            var libraries = await _libraryRepository.GetAllLibrariesAsync();

            return libraries
                .Where(l => !string.IsNullOrEmpty(l.Theme))
                .Select(l => l.Theme)
                .Distinct()
                .OrderBy(theme => theme)
                .ToList();
        }

    }
}