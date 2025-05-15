using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using DTOs.Gallery_Dto;

namespace Api.Services.Interfaces
{
    public interface IGalleryService
    {
        //Returns a list of gallery items with optional filters
        Task<IEnumerable<GalleryItemDto>> GetGalleryItemsAsync(
            int? contractorId,
            int? areaId,
            int? blockId,
            int? cruiseId,
            int? stationId,
            int? sampleId,
            string? mediaType,
            int? year);

        //Returns a media file for downloading (content, type, and filename)
        Task<(Stream Content, string ContentType, string FileName)> GetMediaForDownloadAsync(int mediaId);
    }
}
