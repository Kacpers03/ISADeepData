using System.Collections.Generic;
using System.Threading.Tasks;
using Models.Photo_Video;

namespace Api.Repositories.Interfaces
{
    public interface IGalleryRepository
    {
        Task<IEnumerable<PhotoVideo>> GetGalleryItemsAsync(
            int? contractorId, 
            int? areaId, 
            int? blockId, 
            int? cruiseId, 
            int? stationId, 
            int? sampleId, 
            string mediaType);
        
        Task<PhotoVideo> GetMediaByIdAsync(int mediaId);
    }
}