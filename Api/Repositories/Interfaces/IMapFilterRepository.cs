using System.Collections.Generic;
using System.Threading.Tasks;
using Models.Contractors;
using Models.Cruises;
using Models.Stations;
using Models.Samples;
using Models.Photo_Video;
using DTOs.Contractors_Dto;
using DTOs.Cruise_Dto;
using DTOs.Station_Dto;
using DTOs.Sample_Dto;
using DTOs.PhotoVideo_Dto;

namespace Api.Repositories.Interfaces
{
    public interface IMapFilterRepository
    {
        // Contractor-related methods
        Task<IEnumerable<ContractorDto>> GetContractorsAsync(int? contractTypeId = null, int? contractStatusId = null, 
            string sponsoringState = null, int? year = null);
        Task<IEnumerable<ContractorAreaDto>> GetContractorAreasAsync(int? contractorId = null);
        Task<IEnumerable<ContractorAreaBlockDto>> GetContractorAreaBlocksAsync(int? areaId = null);
        
        // Cruise and Station methods
        Task<IEnumerable<CruiseDto>> GetCruisesAsync(int? contractorId = null);
        Task<IEnumerable<StationDto>> GetStationsAsync(int? cruiseId = null, double? minLat = null, 
            double? maxLat = null, double? minLon = null, double? maxLon = null);
        
        // Sample and Media methods
        Task<IEnumerable<SampleDto>> GetSamplesAsync(int? stationId = null, string sampleType = null);
        Task<IEnumerable<PhotoVideoDto>> GetMediaAsync(int? sampleId = null, string mediaType = null);
        
        // Combined methods for map display
        Task<object> GetMapDataAsync(int? contractorId = null, int? contractTypeId = null, 
            int? contractStatusId = null, string sponsoringState = null, int? year = null, int? cruiseId = null);
        
        // Filter options
        Task<IEnumerable<ContractTypeDto>> GetContractTypesAsync();
        Task<IEnumerable<ContractStatusDto>> GetContractStatusesAsync();
        Task<IEnumerable<string>> GetSponsoringStatesAsync();
        Task<IEnumerable<int>> GetContractualYearsAsync();
        
        // Analytical methods
        Task<object> GetBlockAnalysisAsync(int blockId);
    }
}