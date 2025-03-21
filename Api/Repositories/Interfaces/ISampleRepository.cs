using Models.Samples;

namespace Api.Repositories.Interfaces
{
    public interface ISampleRepository
    {
        Task<List<Sample>> GetAllSamplesAsync();
    }
}
