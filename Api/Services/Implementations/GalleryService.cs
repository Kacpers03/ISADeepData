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
            IGalleryRepository repository, //Initializes repository and configuration
            IConfiguration configuration)
        {
            _repository = repository;
            _connectionString = configuration.GetSection("AzureStorage:GalleryStorage:ConnectionString").Value
                ?? throw new InvalidOperationException("Azure Storage connection string mangler i konfigurasjonen."); //Error message if string does not exist
            _containerName = configuration.GetSection("AzureStorage:GalleryStorage:ContainerName").Value
                ?? throw new InvalidOperationException("Azure Storage container name mangler i konfigurasjonen.");
        }

        public async Task<IEnumerable<GalleryItemDto>> GetGalleryItemsAsync(
            int? contractorId,
            int? areaId,
            int? blockId,
            int? cruiseId,
            int? stationId,
            int? sampleId,
            string? mediaType,
            int? year)
        {
            var mediaItems = await _repository.GetGalleryItemsAsync(
                contractorId, areaId, blockId, cruiseId, stationId, sampleId, mediaType);

            var result = new List<GalleryItemDto>(); //Initializes a list of galleryItems

            foreach (var item in mediaItems)
            {
                //Skips elements that does not exist
                if (item.Sample?.Station?.Cruise?.Contractor == null)
                    continue;

                //Filters by year if possible
                if (year.HasValue && item.CaptureDate.Year != year.Value)
                    continue;

                result.Add(new GalleryItemDto //Adds all attributes
                {
                    MediaId = item.MediaId,
                    FileName = item.FileName,
                    MediaType = item.MediaType,
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
                    ContractorName = item.Sample.Station.Cruise.Contractor.ContractorName
                });
            }

            return result;
        }
        //Function for downloading media
        public async Task<(Stream Content, string ContentType, string FileName)> GetMediaForDownloadAsync(int mediaId) 
        {
            var media = await _repository.GetMediaByIdAsync(mediaId); //Gets ID via the repository

            if (media == null)
            {
                throw new ArgumentException($"Did not find ID: {mediaId}"); //Error code if media does not exist
            }

            var blobServiceClient = new BlobServiceClient(_connectionString); //Uses BlobService by connecting
            var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);
            var blobClient = containerClient.GetBlobClient(media.FileName);

            var response = await blobClient.DownloadAsync(); //Downloads after connecting

            return (response.Value.Content, GetContentType(media.FileName), media.FileName);
        }

        private string GetContentType(string fileName) //Function for getting contenttype
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();

            //Return correct filetype based on ending of the file
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
