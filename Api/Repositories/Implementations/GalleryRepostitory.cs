using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Repositories.Interfaces;
using Models.Photo_Video;

namespace Api.Repositories.Implementations
{
    public class GalleryRepository : IGalleryRepository
    {
        private readonly MyDbContext _context;
        
        public GalleryRepository(MyDbContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<PhotoVideo>> GetGalleryItemsAsync(
            int? contractorId, 
            int? areaId, 
            int? blockId, 
            int? cruiseId, 
            int? stationId, 
            int? sampleId, 
            string mediaType)
        {
            // Start with PhotoVideos and include all related data
            var query = _context.PhotoVideos
                .Include(p => p.Sample)
                    .ThenInclude(s => s.Station)
                        .ThenInclude(st => st.Cruise)
                            .ThenInclude(c => c.Contractor)
                .AsQueryable();
            
            // Apply filters
            if (sampleId.HasValue)
            {
                query = query.Where(p => p.SampleId == sampleId.Value);
            }
            
            if (stationId.HasValue)
            {
                query = query.Where(p => p.Sample.StationId == stationId.Value);
            }
            
            if (cruiseId.HasValue)
            {
                query = query.Where(p => p.Sample.Station.CruiseId == cruiseId.Value);
            }
            
            if (contractorId.HasValue)
            {
                query = query.Where(p => p.Sample.Station.Cruise.ContractorId == contractorId.Value);
            }
            
            if (blockId.HasValue)
            {
                query = query.Where(p => p.Sample.Station.ContractorAreaBlockId == blockId.Value);
            }
            
            if (areaId.HasValue)
            {
                query = query.Where(p => 
                    p.Sample.Station.ContractorAreaBlock != null && 
                    p.Sample.Station.ContractorAreaBlock.AreaId == areaId.Value);
            }
            
            // Handle media type filtering
            if (!string.IsNullOrWhiteSpace(mediaType))
            {
                if (mediaType.ToLower() == "image")
                {
                    query = query.Where(p => 
                        p.MediaType.ToLower().Contains("image") ||
                        p.MediaType.ToLower().Contains("photo") ||
                        p.FileName.EndsWith(".jpg") || 
                        p.FileName.EndsWith(".jpeg") || 
                        p.FileName.EndsWith(".png") ||
                        p.FileName.EndsWith(".gif") ||
                        p.FileName.EndsWith(".bmp") ||
                        p.FileName.EndsWith(".webp")
                    );
                }
                else if (mediaType.ToLower() == "video")
                {
                    query = query.Where(p => 
                        p.MediaType.ToLower().Contains("video") ||
                        p.FileName.EndsWith(".mp4") || 
                        p.FileName.EndsWith(".webm") || 
                        p.FileName.EndsWith(".avi") ||
                        p.FileName.EndsWith(".mov") ||
                        p.FileName.EndsWith(".wmv") ||
                        p.FileName.EndsWith(".flv")
                    );
                }
            }
            
            return await query.ToListAsync();
        }
        
        public async Task<PhotoVideo> GetMediaByIdAsync(int mediaId)
        {
            return await _context.PhotoVideos
                .Include(p => p.Sample)
                    .ThenInclude(s => s.Station)
                        .ThenInclude(st => st.Cruise)
                            .ThenInclude(c => c.Contractor)
                .FirstOrDefaultAsync(p => p.MediaId == mediaId);
        }
    }
}