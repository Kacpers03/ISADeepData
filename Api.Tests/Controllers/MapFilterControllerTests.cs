using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Api.Controllers;
using Api.Data;
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

public class MapFilterControllerTests
{
    private readonly MyDbContext _dbContext;
    private readonly MapFilterController _controller;

    public MapFilterControllerTests()
    {
        var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;

        _dbContext = new MyDbContext(options);
        _dbContext.Database.EnsureDeleted();
        _dbContext.Database.EnsureCreated();

        SeedDatabase();
        _controller = new MapFilterController(_dbContext);
    }

    private void SeedDatabase()
    {
        var contractor = new Contractor
        {
            ContractorId = 1,
            ContractorName = "Test Contractor",
            ContractTypeId = 1,
            ContractStatusId = 1,
            ContractNumber = "123",
            SponsoringState = "USA",
            ContractualYear = 2024,
            Remarks = "Test remarks"
        };
        _dbContext.Contractors.Add(contractor);

        var cruise = new Cruise
        {
            CruiseId = 1,
            ContractorId = 1,
            CruiseName = "Test Cruise",
            ResearchVessel = "Test Vessel",
            StartDate = new System.DateTime(2024, 1, 1),
            EndDate = new System.DateTime(2024, 1, 10)
        };
        _dbContext.Cruises.Add(cruise);

        var station = new Station
        {
            StationId = 1,
            CruiseId = 1,
            StationCode = "ST-001",
            Latitude = 10.0,
            Longitude = 20.0,
            StationType = "Research"
        };
        _dbContext.Stations.Add(station);

        var sample = new Sample
        {
            SampleId = 1,
            StationId = 1,
            SampleCode = "SMP-001",
            SampleType = "Water",
            MatrixType = "Sediment",
            HabitatType = "Deep Sea",
            SamplingDevice = "Core Sampler",
            DepthLower = 100,
            DepthUpper = 50,
            SampleDescription = "Test Sample"
        };
        _dbContext.Samples.Add(sample);

        var photoVideo = new PhotoVideo
        {
            MediaId = 1,
            SampleId = 1,
            FileName = "sample1.jpg",
            MediaType = "Photo",
            CameraSpecs = "4K HD",
            CaptureDate = new System.DateTime(2024, 1, 5),
            Remarks = "Good clarity"
        };
        _dbContext.PhotoVideos.Add(photoVideo);

        _dbContext.SaveChanges();
    }

    [Fact]
    public async Task GetContractors_ReturnsAllContractors()
    {
        var result = await _controller.GetContractors();
        var actionResult = Assert.IsType<ActionResult<IEnumerable<ContractorDto>>>(result);
        var contractors = Assert.IsAssignableFrom<IEnumerable<ContractorDto>>(actionResult.Value);
        Assert.Single(contractors);
    }

    [Fact]
    public async Task GetContractorAreas_ValidContractorId_ReturnsAreas()
    {
        var result = await _controller.GetContractorAreas(1);
        var actionResult = Assert.IsType<ActionResult<IEnumerable<ContractorAreaDto>>>(result);
        var areas = Assert.IsAssignableFrom<IEnumerable<ContractorAreaDto>>(actionResult.Value);
        Assert.Empty(areas);
    }

    [Fact]
    public async Task GetCruises_ValidContractorId_ReturnsCruises()
    {
        var result = await _controller.GetCruises(1);
        var actionResult = Assert.IsType<ActionResult<IEnumerable<CruiseDto>>>(result);
        var cruises = Assert.IsAssignableFrom<IEnumerable<CruiseDto>>(actionResult.Value);
        Assert.Single(cruises);
    }

    [Fact]
    public async Task GetStations_ValidCruiseId_ReturnsStations()
    {
        var result = await _controller.GetStations(1, null, null, null, null);
        var actionResult = Assert.IsType<ActionResult<IEnumerable<StationDto>>>(result);
        var stations = Assert.IsAssignableFrom<IEnumerable<StationDto>>(actionResult.Value);
        Assert.Single(stations);
    }

    [Fact]
    public async Task GetSamples_ValidStationId_ReturnsSamples()
    {
        var result = await _controller.GetSamples(1, null);
        var actionResult = Assert.IsType<ActionResult<IEnumerable<SampleDto>>>(result);
        var samples = Assert.IsAssignableFrom<IEnumerable<SampleDto>>(actionResult.Value);
        Assert.Single(samples);
    }

    [Fact]
    public async Task GetMedia_ValidSampleId_ReturnsMedia()
    {
        var result = await _controller.GetMedia(1, null);
        var actionResult = Assert.IsType<ActionResult<IEnumerable<PhotoVideoDto>>>(result);
        var media = Assert.IsAssignableFrom<IEnumerable<PhotoVideoDto>>(actionResult.Value);
        Assert.Single(media);
    }
}
