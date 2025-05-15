using System.Collections.Generic;
using System.Threading.Tasks;
using Models.Photo_Video;

namespace Api.Repositories.Interfaces
{
    // Repository for photo/video items
    public interface IGalleryRepository
    {
        // Get media items with optional filters
        Task<IEnumerable<PhotoVideo>> GetGalleryItemsAsync(
            int? contractorId,
            int? areaId,
            int? blockId,
            int? cruiseId,
            int? stationId,
            int? sampleId,
            string mediaType);
        
        // Get a single media item by ID
        Task<PhotoVideo> GetMediaByIdAsync(int mediaId);
    }
}
