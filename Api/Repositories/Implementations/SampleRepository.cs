using Api.Data;
using Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models.Samples;

namespace Api.Repositories.Implementations
{
    /// <summary>
    /// Repository for retrieving sample data, including related station, cruise, and contractor info.
    /// Implements ISampleRepository.
    /// </summary>
    public class SampleRepository : ISampleRepository
    {
        private readonly MyDbContext _context;

        /// <summary>
        /// Constructor: receives EF Core DbContext via dependency injection.
        /// </summary>
        public SampleRepository(MyDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all samples, including their station, cruise, and contractor information.
        /// </summary>
        public async Task<List<Sample>> GetAllSamplesAsync()
        {
            // Query the Samples DbSet
            return await _context.Samples
                // Include related Station
                .Include(s => s.Station)
                    // Then include Cruise from Station
                    .ThenInclude(st => st.Cruise)
                        // Then include Contractor from Cruise
                        .ThenInclude(c => c.Contractor)
                // Execute the query and return the list
                .ToListAsync();
        }
    }
}