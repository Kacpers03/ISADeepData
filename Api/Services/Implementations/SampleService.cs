using Api.Data;
using Api.Services.Interfaces;
using DTOs.Sample_Dto;
using Microsoft.EntityFrameworkCore;
using Api.Repositories.Interfaces;

namespace Api.Services.Implementations
{
    public class SampleService : ISampleService
    {
        private readonly ISampleRepository _sampleRepository;

        public SampleService(ISampleRepository sampleRepository)
        {
            _sampleRepository = sampleRepository;
        }


        // Get all samples with full DTO mapping
        public async Task<List<SampleDto>> GetAllSamplesAsync()
        {
            var samples = await _sampleRepository.GetAllSamplesAsync();

            return samples.Select(s => new SampleDto
            {
                SampleId = s.SampleId,
                SampleCode = s.SampleCode,
                SampleType = s.SampleType,
                MatrixType = s.MatrixType,
                HabitatType = s.HabitatType,
                SamplingDevice = s.SamplingDevice,
                DepthLower = s.DepthLower,
                DepthUpper = s.DepthUpper,
                SampleDescription = s.SampleDescription,
                Analysis = s.Analysis,        
                Result = s.Result, 
                Unit = s.Unit           
                 // or map if you add it to entity
            }).ToList();
        }



        // Get distinct SampleTypes (for filtering dropdown)
        public async Task<List<string>> GetDistinctSampleTypesAsync()
        {
            var samples = await _sampleRepository.GetAllSamplesAsync();
            return samples
                .Where(s => !string.IsNullOrEmpty(s.SampleType))
                .Select(s => s.SampleType)
                .Distinct()
                .OrderBy(s => s)
                .ToList();
        }


        //  Get distinct MatrixTypes (corrected version)
        public async Task<List<string>> GetDistinctMatrixTypesAsync()
        {
            var samples = await _sampleRepository.GetAllSamplesAsync();

            return samples
                .Where(s => !string.IsNullOrEmpty(s.MatrixType))
                .Select(s => s.MatrixType)
                .Distinct()
                .OrderBy(s => s)
                .ToList();
        }

        //  Get distinct HabitatTypes (corrected version)
        public async Task<List<string>> GetDistinctHabitatTypesAsync()
        {
            var samples = await _sampleRepository.GetAllSamplesAsync();

            return samples
                .Where(s => !string.IsNullOrEmpty(s.HabitatType))
                .Select(s => s.HabitatType)
                .Distinct()
                .OrderBy(s => s)
                .ToList();
        }

        public async Task<List<string>> GetDistinctAnalysesAsync()
        {
            var samples = await _sampleRepository.GetAllSamplesAsync();

            return samples
                .Where(s => !string.IsNullOrEmpty(s.Analysis))
                .Select(s => s.Analysis)
                .Distinct()
                .OrderBy(a => a)
                .ToList();
        }
    }
}
