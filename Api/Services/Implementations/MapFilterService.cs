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

        public MapFilterService(
            IMapFilterRepository repository,
            IMemoryCache cache,
            ILogger<MapFilterService> logger)
        {
            _repository = repository;
            _cache = cache;
            _logger = logger;
        }

        public async Task<IEnumerable<ContractorDto>> GetContractorsAsync(
            int? contractTypeId = null, 
            int? contractStatusId = null, 
            string? sponsoringState = null, 
            int? year = null)
        {
            var cacheKey = $"Contractors_{contractTypeId}_{contractStatusId}_{sponsoringState}_{year}";
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<ContractorDto> contractors))
            {
                _logger.LogInformation("Cache miss for {CacheKey}", cacheKey);
                
                contractors = await _repository.GetContractorsAsync(
                    contractTypeId, 
                    contractStatusId, 
                    sponsoringState, 
                    year
                );
                
                // Enrich with additional information
                foreach (var contractor in contractors)
                {
                    contractor.Remarks = string.IsNullOrEmpty(contractor.Remarks) ? 
                        $"Contract established in {contractor.ContractualYear}" : 
                        contractor.Remarks;
                }
                
                // Cache for 10 minutes
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(10));
                    
                _cache.Set(cacheKey, contractors, cacheOptions);
            }
            
            return contractors;
        }

        public async Task<IEnumerable<ContractorAreaDto>> GetContractorAreasAsync(int? contractorId = null)
        {
            var cacheKey = $"ContractorAreas_{contractorId}";
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<ContractorAreaDto> areas))
            {
                areas = await _repository.GetContractorAreasAsync(contractorId);
                
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(10));
                    
                _cache.Set(cacheKey, areas, cacheOptions);
            }
            
            return areas;
        }

        public async Task<IEnumerable<ContractorAreaBlockDto>> GetContractorAreaBlocksAsync(int? areaId = null)
        {
            var cacheKey = $"ContractorAreaBlocks_{areaId}";
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<ContractorAreaBlockDto> blocks))
            {
                blocks = await _repository.GetContractorAreaBlocksAsync(areaId);
                
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(10));
                    
                _cache.Set(cacheKey, blocks, cacheOptions);
            }
            
            return blocks;
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

        public async Task<IEnumerable<SampleDto>> GetSamplesAsync(int? stationId = null, string? sampleType = null)
        {
            return await _repository.GetSamplesAsync(stationId, sampleType);
        }

        public async Task<IEnumerable<PhotoVideoDto>> GetMediaAsync(int? sampleId = null, string? mediaType = null)
        {
            return await _repository.GetMediaAsync(sampleId, mediaType);
        }

        public async Task<object> GetMapDataAsync(int? contractorId = null, int? contractTypeId = null, 
            int? contractStatusId = null, string? sponsoringState = null, int? year = null, int? cruiseId = null)
        {
            var cacheKey = $"MapData_{contractorId}_{contractTypeId}_{contractStatusId}_{sponsoringState}_{year}_{cruiseId}";
            
            if (!_cache.TryGetValue(cacheKey, out object mapData))
            {
                mapData = await _repository.GetMapDataAsync(
                    contractorId, 
                    contractTypeId, 
                    contractStatusId, 
                    sponsoringState, 
                    year, 
                    cruiseId
                );
                
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(5));
                    
                _cache.Set(cacheKey, mapData, cacheOptions);
            }
            
            return mapData;
        }

        public async Task<IEnumerable<ContractTypeDto>> GetContractTypesAsync()
        {
            var cacheKey = "ContractTypes";
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<ContractTypeDto> types))
            {
                types = await _repository.GetContractTypesAsync();
                
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(24));
                    
                _cache.Set(cacheKey, types, cacheOptions);
            }
            
            return types;
        }

        public async Task<IEnumerable<ContractStatusDto>> GetContractStatusesAsync()
        {
            var cacheKey = "ContractStatuses";
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<ContractStatusDto> statuses))
            {
                statuses = await _repository.GetContractStatusesAsync();
                
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(24));
                    
                _cache.Set(cacheKey, statuses, cacheOptions);
            }
            
            return statuses;
        }

        public async Task<IEnumerable<string>> GetSponsoringStatesAsync()
        {
            var cacheKey = "SponsoringStates";
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<string> states))
            {
                states = await _repository.GetSponsoringStatesAsync();
                
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(24));
                    
                _cache.Set(cacheKey, states, cacheOptions);
            }
            
            return states;
        }

        public async Task<IEnumerable<int>> GetContractualYearsAsync()
        {
            var cacheKey = "ContractualYears";
            
            if (!_cache.TryGetValue(cacheKey, out IEnumerable<int> years))
            {
                years = await _repository.GetContractualYearsAsync();
                
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(24));
                    
                _cache.Set(cacheKey, years, cacheOptions);
            }
            
            return years;
        }
        
        public async Task<object> GetBlockAnalysisAsync(int blockId)
        {
            return await _repository.GetBlockAnalysisAsync(blockId);
        }
    }
}