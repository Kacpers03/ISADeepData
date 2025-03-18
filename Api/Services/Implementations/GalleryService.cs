using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;
using DTOs.Gallery_Dto;

namespace Api.Services.Implementations
{
    public class GalleryService : IGalleryService
    {
        private readonly IGalleryRepository _repository;
        private readonly string _connectionString;
        private readonly string _containerName;
        
        public GalleryService(
            IGalleryRepository repository,
            IConfiguration configuration)
        {
            _repository = repository;
            _connectionString = configuration.GetSection("AzureBlobStorage:ConnectionString").Value;
            _containerName = configuration.GetSection("AzureBlobStorage:ContainerName").Value;
        }
        
        public async Task<IEnumerable<GalleryItemDto>> GetGalleryItemsAsync(
            int? contractorId, 
            int? areaId, 
            int? blockId, 
            int? cruiseId, 
            int? stationId, 
            int? sampleId, 
            string mediaType,
            int? year)
        {
            var mediaItems = await _repository.GetGalleryItemsAsync(
                contractorId, areaId, blockId, cruiseId, stationId, sampleId, mediaType);
            
            var result = new List<GalleryItemDto>();
            
            foreach (var item in mediaItems)
            {
                if (item.Sample?.Station?.Cruise?.Contractor == null)
                    continue;
                    
                // Apply year filter if specified
                if (year.HasValue && item.CaptureDate.Year != year.Value)
                    continue;
                    
                result.Add(new GalleryItemDto
                {
                    MediaId = item.MediaId,
                    FileName = item.FileName,
                    MediaType = item.MediaType,
                    MediaUrl = "", // Will be set in controller
                    CaptureDate = item.CaptureDate,
                    CameraSpecs = item.CameraSpecs,
                    Remarks = item.Remarks,
                    SampleId = item.Sample.SampleId,
                    SampleCode = item.Sample.SampleCode,
                    SampleType = item.Sample.SampleType,
                    StationId = item.Sample.Station.StationId,
                    StationCode = item.Sample.Station.StationCode,
                    Latitude = item.Sample.Station.Latitude,
                    Longitude = item.Sample.Station.Longitude,
                    CruiseId = item.Sample.Station.Cruise.CruiseId,
                    CruiseName = item.Sample.Station.Cruise.CruiseName,
                    ContractorId = item.Sample.Station.Cruise.Contractor.ContractorId,
                    ContractorName = item.Sample.Station.Cruise.Contractor.ContractorName,
                    // Properties for frontend
                    FileUrl = "", // Will be set in controller
                    ThumbnailUrl = "", // Will be set in controller
                    Description = item.Remarks // Use remarks as description
                });
            }
            
            return result;
        }
        
        public async Task<(Stream Content, string ContentType, string FileName)> GetMediaForDownloadAsync(int mediaId)
        {
            var media = await _repository.GetMediaByIdAsync(mediaId);
            if (media == null)
            {
                throw new ArgumentException($"Media with ID {mediaId} not found");
            }
            
            var blobServiceClient = new BlobServiceClient(_connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);
            var blobClient = containerClient.GetBlobClient(media.FileName);
            
            var response = await blobClient.DownloadAsync();
            
            return (response.Value.Content, GetContentType(media.FileName), media.FileName);
        }
        
        private string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".mp4" => "video/mp4",
                ".mov" => "video/quicktime",
                ".avi" => "video/x-msvideo",
                _ => "application/octet-stream"
            };
        }
    }
}