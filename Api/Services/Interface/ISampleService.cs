using DTOs.Sample_Dto;

namespace Api.Services.Interfaces
{
    public interface ISampleService
    {
        Task<List<SampleDto>> GetAllSamplesAsync();
        Task<List<string>> GetDistinctSampleTypesAsync();
        Task<List<string>> GetDistinctMatrixTypesAsync();
        Task<List<string>> GetDistinctHabitatTypesAsync();
        Task<List<string>> GetDistinctAnalysesAsync();
        Task<List<string>> GetDistinctStationCodesAsync();
        Task<List<string>> GetDistinctCruiseNamesAsync();
        Task<List<string>> GetDistinctContractorNamesAsync();


    }
}
