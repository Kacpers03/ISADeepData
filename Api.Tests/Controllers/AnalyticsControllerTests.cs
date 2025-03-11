using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using Api.Controllers;
using Api.Data;
using Api.Services.Interfaces;
using Models.Contractors;
using Models.Cruises;
using Models.Stations;
using Models.Samples;
using Models.Env_Result;
using Models.Geo_result;
using Models.Photo_Video;

public class AnalyticsControllerTests
{
    private readonly MyDbContext _dbContext;
    private readonly AnalyticsController _controller;
    private readonly Mock<ISpatialService> _mockSpatialService;
    private readonly Mock<IMapFilterService> _mockMapFilterService;

    public AnalyticsControllerTests()
    {
        var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;

        _dbContext = new MyDbContext(options);
        _dbContext.Database.EnsureDeleted();
        _dbContext.Database.EnsureCreated();

        _mockSpatialService = new Mock<ISpatialService>();
        _mockMapFilterService = new Mock<IMapFilterService>();

        SeedDatabase();
        _controller = new AnalyticsController(_dbContext, _mockSpatialService.Object, _mockMapFilterService.Object);
    }

    private void SeedDatabase()
{
    _dbContext.Database.EnsureDeleted(); // ✅ Clears existing records and identity values
    _dbContext.Database.EnsureCreated(); // ✅ Recreates tables with fresh identity values

    var contractor = new Contractor
    {
        ContractorId = 2,  // EF Core InMemory requires manually setting the key
        ContractorName = "Test Contractor",
        ContractTypeId = 2,
        ContractStatusId = 2,
        ContractNumber = "123",
        SponsoringState = "USA",
        ContractualYear = 2024,
        Remarks = "Test remarks"
    };
    _dbContext.Contractors.Add(contractor);

    var cruise = new Cruise
    {
        CruiseId = 2,
        ContractorId = 2,
        CruiseName = "Test Cruise",
        ResearchVessel = "Test Vessel",
        StartDate = new System.DateTime(2024, 1, 1),
        EndDate = new System.DateTime(2024, 1, 10)
    };
    _dbContext.Cruises.Add(cruise);

    _dbContext.SaveChanges(); //  Save incrementally to prevent ID conflicts

    var station = new Station
    {
        StationId = 2,
        CruiseId = 2,
        StationCode = "ST-001",
        Latitude = 10.0,
        Longitude = 20.0,
        StationType = "Research"
    };
    _dbContext.Stations.Add(station);

    var sample = new Sample
    {
        SampleId = 2,
        StationId = 2,
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

    _dbContext.SaveChanges(); // ✅ Save in smaller steps to prevent primary key reuse

    var photoVideo = new PhotoVideo
    {
        MediaId = 2,
        SampleId = 2,
        FileName = "sample1.jpg",
        MediaType = "Photo",
        CameraSpecs = "4K HD",
        CaptureDate = new System.DateTime(2024, 1, 5),
        Remarks = "Good clarity"
    };
    _dbContext.PhotoVideos.Add(photoVideo);

    _dbContext.SaveChanges(); // ✅ Final commit
}


    [Fact]
    public async Task GetContractorSummary_ExistingContractor_ReturnsSummary()
    {
        var result = await _controller.GetContractorSummary(1);
        var actionResult = Assert.IsType<ActionResult<object>>(result);
        var summary = Assert.IsType<OkObjectResult>(actionResult.Result);
        Assert.NotNull(summary.Value);
    }

    [Fact]
    public async Task GetContractorSummary_NonExistingContractor_ReturnsNotFound()
    {
        var result = await _controller.GetContractorSummary(999);
        var actionResult = Assert.IsType<ActionResult<object>>(result);
        Assert.IsType<NotFoundResult>(actionResult.Result);
    }
}
