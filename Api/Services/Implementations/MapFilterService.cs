using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;
using DTOs.Contractors_Dto;
using DTOs.Cruise_Dto;
using DTOs.Station_Dto;
using DTOs.Sample_Dto;
using DTOs.PhotoVideo_Dto;

namespace Api.Services.Implementations
{
    public class MapFilterService : IMapFilterService
    {
        private readonly IMapFilterRepository _repository;

        public MapFilterService(IMapFilterRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ContractorDto>> GetContractorsAsync(int? contractTypeId = null, int? contractStatusId = null, 
            string sponsoringState = null, int? year = null)
        {
            return await _repository.GetContractorsAsync(contractTypeId, contractStatusId, sponsoringState, year);
        }

        public async Task<IEnumerable<ContractorAreaDto>> GetContractorAreasAsync(int? contractorId = null)
        {
            return await _repository.GetContractorAreasAsync(contractorId);
        }

        public async Task<IEnumerable<ContractorAreaBlockDto>> GetContractorAreaBlocksAsync(int? areaId = null)
        {
            return await _repository.GetContractorAreaBlocksAsync(areaId);
        }

        public async Task<IEnumerable<CruiseDto>> GetCruisesAsync(int? contractorId = null)
        {
            return await _repository.GetCruisesAsync(contractorId);
        }

        public async Task<IEnumerable<StationDto>> GetStationsAsync(int? cruiseId = null, double? minLat = null, 
            double? maxLat = null, double? minLon = null, double? maxLon = null)
        {
            return await _repository.GetStationsAsync(cruiseId, minLat, maxLat, minLon, maxLon);
        }

        public async Task<IEnumerable<SampleDto>> GetSamplesAsync(int? stationId = null, string sampleType = null)
        {
            return await _repository.GetSamplesAsync(stationId, sampleType);
        }

        public async Task<IEnumerable<PhotoVideoDto>> GetMediaAsync(int? sampleId = null, string mediaType = null)
        {
            return await _repository.GetMediaAsync(sampleId, mediaType);
        }

        public async Task<object> GetMapDataAsync(int? contractorId = null, int? contractTypeId = null, 
            int? contractStatusId = null, string sponsoringState = null, int? year = null, int? cruiseId = null)
        {
            return await _repository.GetMapDataAsync(contractorId, contractTypeId, contractStatusId, sponsoringState, year, cruiseId);
        }

        public async Task<IEnumerable<ContractTypeDto>> GetContractTypesAsync()
        {
            return await _repository.GetContractTypesAsync();
        }

        public async Task<IEnumerable<ContractStatusDto>> GetContractStatusesAsync()
        {
            return await _repository.GetContractStatusesAsync();
        }

        public async Task<IEnumerable<string>> GetSponsoringStatesAsync()
        {
            return await _repository.GetSponsoringStatesAsync();
        }

        public async Task<IEnumerable<int>> GetContractualYearsAsync()
        {
            return await _repository.GetContractualYearsAsync();
        }
    }
}