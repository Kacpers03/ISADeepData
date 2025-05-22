using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
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
        private readonly IMemoryCache _cache;
        private readonly ILogger<MapFilterService> _logger;

        public MapFilterService( //Initializes Cache, repository and a logger
            IMapFilterRepository repository,
            IMemoryCache cache,
            ILogger<MapFilterService> logger)
        {
            _repository = repository;
            _cache = cache;
            _logger = logger;
        }

        public async Task<IEnumerable<ContractorDto>> GetContractorsAsync( //Fetching Contractprs using first cache or repository
            int? contractTypeId = null, 
            int? contractStatusId = null, 
            string? sponsoringState = null, 
            int? year = null)
        {
            var cacheKey = $"Contractors_{contractTypeId}_{contractStatusId}_{sponsoringState}_{year}"; //Cachekey
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<ContractorDto> contractors)) //Tries to use Cache first
            {
                _logger.LogInformation("Cache miss for {CacheKey}", cacheKey);
                
                contractors = await _repository.GetContractorsAsync( //Uses repository function
                    contractTypeId, 
                    contractStatusId, 
                    sponsoringState, 
                    year
                );
                
                //Enrich with additional information
                foreach (var contractor in contractors)
                {
                    contractor.Remarks = string.IsNullOrEmpty(contractor.Remarks) ? 
                        $"Contract established in {contractor.ContractualYear}" : 
                        contractor.Remarks;
                }
                
                //Cache for 10 minutes
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(10));
                    
                _cache.Set(cacheKey, contractors, cacheOptions);
            }
            
            return contractors;
        }

        public async Task<IEnumerable<ContractorAreaDto>> GetContractorAreasAsync(int? contractorId = null) //Get contractor area
        {
            var cacheKey = $"ContractorAreas_{contractorId}"; //tries using cache first
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<ContractorAreaDto> areas)) //if cache does not exist, get info via repo
            {
                areas = await _repository.GetContractorAreasAsync(contractorId);
                
                var cacheOptions = new MemoryCacheEntryOptions() //cache exist in 10 minute
                    .SetSlidingExpiration(TimeSpan.FromMinutes(10));
                    
                _cache.Set(cacheKey, areas, cacheOptions); 
            }
            
            return areas; //returns area
        }

        public async Task<IEnumerable<ContractorAreaBlockDto>> GetContractorAreaBlocksAsync(int? areaId = null) //Get contractorarea block based on id
        {
            var cacheKey = $"ContractorAreaBlocks_{areaId}"; 
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<ContractorAreaBlockDto> blocks)) //if cache does not exist
            {
                blocks = await _repository.GetContractorAreaBlocksAsync(areaId);
                
                var cacheOptions = new MemoryCacheEntryOptions() //cache exists in max 10 min
                    .SetSlidingExpiration(TimeSpan.FromMinutes(10));
                    
                _cache.Set(cacheKey, blocks, cacheOptions);
            }
            
            return blocks; //returns blocks
        }

        public async Task<IEnumerable<CruiseDto>> GetCruisesAsync(int? contractorId = null) //get cruises based on ID
        {
            return await _repository.GetCruisesAsync(contractorId);
        }

        public async Task<IEnumerable<StationDto>> GetStationsAsync(int? cruiseId = null, double? minLat = null, //Get stations based on ID
            double? maxLat = null, double? minLon = null, double? maxLon = null)
        {
            return await _repository.GetStationsAsync(cruiseId, minLat, maxLat, minLon, maxLon);
        }

        public async Task<IEnumerable<SampleDto>> GetSamplesAsync(int? stationId = null, string? sampleType = null) //Get samples based on stationID
        {
            return await _repository.GetSamplesAsync(stationId, sampleType);
        }

        public async Task<IEnumerable<PhotoVideoDto>> GetMediaAsync(int? sampleId = null, string? mediaType = null) //Get media based on sampleID
        {
            return await _repository.GetMediaAsync(sampleId, mediaType);
        }

        public async Task<object> GetMapDataAsync(int? contractorId = null, int? contractTypeId = null, //Get map data based on contractor, contracttype and so on.
            int? contractStatusId = null, string? sponsoringState = null, int? year = null, int? cruiseId = null)
        {
            var cacheKey = $"MapData_{contractorId}_{contractTypeId}_{contractStatusId}_{sponsoringState}_{year}_{cruiseId}";
            
            if (!_cache.TryGetValue(cacheKey, out object mapData)) //if cache does not exist
            {
                mapData = await _repository.GetMapDataAsync( //Uses repo if not exist
                    contractorId, 
                    contractTypeId, 
                    contractStatusId, 
                    sponsoringState, 
                    year, 
                    cruiseId
                );
                
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(5)); //Exists in max 5 min
                    
                _cache.Set(cacheKey, mapData, cacheOptions);
            }
            
            return mapData;
        }

        public async Task<IEnumerable<ContractTypeDto>> GetContractTypesAsync() //Get contract types based on cache or repo id
        {
            var cacheKey = "ContractTypes";
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<ContractTypeDto> types)) //If cache does not exist
            {
                types = await _repository.GetContractTypesAsync();
                
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(24)); //Stays in the system in 24 hours
                    
                _cache.Set(cacheKey, types, cacheOptions);
            }
            
            return types;
        }

        public async Task<IEnumerable<ContractStatusDto>> GetContractStatusesAsync() //Get contract status
        {
            var cacheKey = "ContractStatuses";
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<ContractStatusDto> statuses)) //If cache does not exist
            {
                statuses = await _repository.GetContractStatusesAsync();
                
                var cacheOptions = new MemoryCacheEntryOptions() //Max 24 hours
                    .SetAbsoluteExpiration(TimeSpan.FromHours(24));
                    
                _cache.Set(cacheKey, statuses, cacheOptions);
            }
            
            return statuses; //Returns it
        }

        public async Task<IEnumerable<string>> GetSponsoringStatesAsync() //Get sponsoring states
        {
            var cacheKey = "SponsoringStates";
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<string> states)) //If cache does not exist
            {
                states = await _repository.GetSponsoringStatesAsync();
                
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(24)); //Stays in cache in 24 hours
                    
                _cache.Set(cacheKey, states, cacheOptions);
            }
            
            return states;
        }

        public async Task<IEnumerable<int>> GetContractualYearsAsync() //Get contract years
        {
            var cacheKey = "ContractualYears";
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<int> years)) //If cache does not exist
            {
                years = await _repository.GetContractualYearsAsync();
                
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(24)); //24 hours limit
                    
                _cache.Set(cacheKey, years, cacheOptions);
            }
            
            return years;
        }
        
        public async Task<object> GetBlockAnalysisAsync(int blockId) //Get the block analysis from the block id
        {
            return await _repository.GetBlockAnalysisAsync(blockId);
        }
    }
}