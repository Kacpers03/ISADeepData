using Azure.Storage.Blobs;
using DTOs.Library_Dto;
using Microsoft.AspNetCore.Http;
using Models.Librarys;
using Api.Services.Interfaces;
using Api.Data; // Your DbContext namespace

namespace Api.Services.Implementations
{
    public class LibraryService : ILibraryService
    {
        private readonly MyDbContext _context;
        private readonly string _connectionString;
        private readonly string _containerName;

        public LibraryService(MyDbContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = "DefaultEndpointsProtocol=https;AccountName=isalibraryfiles;AccountKey=C9ws6y40U+9e1TERxRbaojY5F6yyWuQrbF2eGLLGgnPOp7IuFewl4BzgKCzPwCW0BZD+8YIrApWH+AStog45Dw==;EndpointSuffix=core.windows.net";
            _containerName = "files";
        }

        public async Task<string> UploadFileAsync(IFormFile file, LibraryDto dto)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is missing.");

            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);
            await containerClient.CreateIfNotExistsAsync();

            var blobClient = containerClient.GetBlobClient(file.FileName);
            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, overwrite: true);
            }

            var fileUrl = blobClient.Uri.ToString();

            var libraryEntity = new Library
            {
                ContractorId = dto.ContractorId,
                Theme = dto.Theme,
                FileName = file.FileName,
                Title = dto.Title,
                Description = dto.Description,
                SubmissionDate = dto.SubmissionDate,
                IsConfidential = dto.IsConfidential
            };

            _context.Libraries.Add(libraryEntity);
            await _context.SaveChangesAsync();

            return fileUrl;
        }

        public async Task<List<LibraryDto>> GetAllAsync()
        {
            var items = _context.Libraries.Select(l => new LibraryDto
            {
                LibraryId = l.LibraryId,
                ContractorId = l.ContractorId,
                Theme = l.Theme,
                FileName = l.FileName,
                Title = l.Title,
                Description = l.Description,
                SubmissionDate = l.SubmissionDate,
                IsConfidential = l.IsConfidential
            }).ToList();

            return await Task.FromResult(items);
        }
    }
}
