using System.Collections.Generic;
using System.Threading.Tasks;
using DTOs.Contractors_Dto;
using DTOs.Cruise_Dto;
using DTOs.Station_Dto;
using DTOs.Sample_Dto;
using DTOs.PhotoVideo_Dto;

namespace Api.Services.Interfaces
{
    public interface IMapFilterService
    {
        Task<IEnumerable<ContractorDto>> GetContractorsAsync(int? contractTypeId = null, int? contractStatusId = null, 
            string? sponsoringState = null, int? year = null);
        Task<IEnumerable<ContractorAreaDto>> GetContractorAreasAsync(int? contractorId = null);
        Task<IEnumerable<ContractorAreaBlockDto>> GetContractorAreaBlocksAsync(int? areaId = null);
        Task<IEnumerable<CruiseDto>> GetCruisesAsync(int? contractorId = null);
        Task<IEnumerable<StationDto>> GetStationsAsync(int? cruiseId = null, double? minLat = null, 
            double? maxLat = null, double? minLon = null, double? maxLon = null);
        Task<IEnumerable<SampleDto>> GetSamplesAsync(int? stationId = null, string? sampleType = null);
        Task<IEnumerable<PhotoVideoDto>> GetMediaAsync(int? sampleId = null, string? mediaType = null);
        Task<object> GetMapDataAsync(int? contractorId = null, int? contractTypeId = null, 
            int? contractStatusId = null, string? sponsoringState = null, int? year = null, int? cruiseId = null);
        Task<IEnumerable<ContractTypeDto>> GetContractTypesAsync();
        Task<IEnumerable<ContractStatusDto>> GetContractStatusesAsync();
        Task<IEnumerable<string>> GetSponsoringStatesAsync();
        Task<IEnumerable<int>> GetContractualYearsAsync();
        Task<object> GetBlockAnalysisAsync(int blockId);
    }
}