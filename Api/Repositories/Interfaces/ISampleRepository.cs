using Models.Samples;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Repositories.Interfaces
{
    // Repository for sample data
    public interface ISampleRepository
    {
        // Retrieve all samples with related data
        Task<List<Sample>> GetAllSamplesAsync();
    }
}
