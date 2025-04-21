using Api.Data;
using Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models.Samples;

namespace Api.Repositories.Implementations
{
    public class SampleRepository : ISampleRepository
    {
        private readonly MyDbContext _context;

        public SampleRepository(MyDbContext context)
        {
            _context = context;
        }

        public async Task<List<Sample>> GetAllSamplesAsync()
        {
            return await _context.Samples
                .Include(s => s.Station)
                    .ThenInclude(st => st.Cruise)
                        .ThenInclude(c => c.Contractor)
                .ToListAsync();
        }
    }
}
