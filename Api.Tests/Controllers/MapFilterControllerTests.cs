using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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

        SeedDatabase(_dbContext);
        _controller = new MapFilterController(_dbContext);
    }

    private void SeedDatabase(MyDbContext context)
{
    // Contract Type & Status (if needed)
    context.ContractTypes.Add(new ContractType { ContractTypeId = 1, ContractTypeName = "Exploration" });
    context.ContractStatuses.Add(new ContractStatus { ContractStatusId = 1, ContractStatusName = "Active" });
    context.SaveChanges();

    // Contractor
    var contractor = new Contractor
    {
        ContractorId = 1,
        ContractorName = "Test Contractor",
        ContractTypeId = 1,
        ContractStatusId = 1,
        ContractNumber = "TC-001",
        SponsoringState = "USA",
        ContractualYear = 2024,
        Remarks = "Seeded for testing",
        ContractorAreas = new List<ContractorArea>(),
    };
    context.Contractors.Add(contractor);
    context.SaveChanges();

    // Area & Block
    var area = new ContractorArea
    {
        AreaId = 1,
        ContractorId = 1,
        AreaName = "Test Area",
        AreaDescription = "Test area description",
        GeoJsonBoundary = "{}",
        CenterLatitude = 10,
        CenterLongitude = 20,
        TotalAreaSizeKm2 = 100,
        AllocationDate = DateTime.UtcNow.AddYears(-1),
        ExpiryDate = DateTime.UtcNow.AddYears(5),
        ContractorAreaBlocks = new List<ContractorAreaBlock>()
    };

    var block = new ContractorAreaBlock
    {
        BlockId = 1,
        AreaId = 1,
        BlockName = "Block A",
        BlockDescription = "Seeded block",
        GeoJsonBoundary = "{}",
        CenterLatitude = 10.1,
        CenterLongitude = 20.1,
        AreaSizeKm2 = 25,
        Status = "Active",
        Category = "Test",
        ResourceDensity = 3.0,
        EconomicValue = 10000,
    };

    area.ContractorAreaBlocks.Add(block);
    contractor.ContractorAreas.Add(area);
    context.ContractorAreas.Add(area);
    context.ContractorAreaBlocks.Add(block);
    context.SaveChanges();

    // Cruise
    var cruise = new Cruise
    {
        CruiseId = 1,
        ContractorId = contractor.ContractorId,
        CruiseName = "Test Cruise",
        ResearchVessel = "Seed Ship",
        StartDate = new DateTime(2024, 1, 1),
        EndDate = new DateTime(2024, 1, 10),
        Stations = new List<Station>()
    };
    context.Cruises.Add(cruise);
    context.SaveChanges();

    // Station
    var station = new Station
    {
        StationId = 1,
        CruiseId = cruise.CruiseId,
        StationCode = "ST-001",
        StationType = "Research",
        Latitude = 10,
        Longitude = 20
    };
    cruise.Stations.Add(station);
    context.Stations.Add(station);
    context.SaveChanges();

    // Sample
    var sample = new Sample
    {
        SampleId = 1,
        StationId = station.StationId,
        SampleCode = "SMP-001",
        SampleType = "Water",
        MatrixType = "Sediment",
        HabitatType = "Deep",
        SamplingDevice = "Core",
        DepthLower = 100,
        DepthUpper = 50,
        SampleDescription = "Seeded sample",
        Analysis = "Chemical",
        Result = 40.0,
        Unit = "mg/L"
    };
    context.Samples.Add(sample);
    context.SaveChanges();

    // Media
    var media = new PhotoVideo
    {
        MediaId = 1,
        SampleId = sample.SampleId,
        FileName = "sample1.jpg",
        MediaType = "Photo",
        CameraSpecs = "4K",
        CaptureDate = DateTime.UtcNow,
        Remarks = "Clarity good"
    };
    context.PhotoVideos.Add(media);
    context.SaveChanges();
}



    [Fact]
public async Task GetContractors_ReturnsSeededContractor()
{
    var result = await _controller.GetContractors();
    var okResult = Assert.IsType<ActionResult<IEnumerable<ContractorDto>>>(result);
    var contractors = Assert.IsAssignableFrom<IEnumerable<ContractorDto>>(okResult.Value);
    var contractor = contractors.FirstOrDefault();

    Assert.Single(contractors);
    Assert.Equal("Test Contractor", contractor.ContractorName);
}

[Fact]
public async Task GetCruises_ReturnsSeededCruise()
{
    var result = await _controller.GetCruises(null);
    var okResult = Assert.IsType<ActionResult<IEnumerable<CruiseDto>>>(result);
    var cruises = Assert.IsAssignableFrom<IEnumerable<CruiseDto>>(okResult.Value);
    var cruise = cruises.FirstOrDefault();

    Assert.Single(cruises);
    Assert.Equal("Test Cruise", cruise.CruiseName);
    Assert.Equal(1, cruise.ContractorId);
}

[Fact]
public async Task GetStations_ReturnsSeededStation()
{
    var result = await _controller.GetStations(null, null, null, null, null);
    var okResult = Assert.IsType<ActionResult<IEnumerable<StationDto>>>(result);
    var stations = Assert.IsAssignableFrom<IEnumerable<StationDto>>(okResult.Value);
    var station = stations.FirstOrDefault();

    Assert.Single(stations);
    Assert.Equal("ST-001", station.StationCode);
    Assert.Equal(10.0, station.Latitude);
}

[Fact]
public async Task GetSamples_ReturnsSeededSample()
{
    var result = await _controller.GetSamples(1, null);
    var okResult = Assert.IsType<ActionResult<IEnumerable<SampleDto>>>(result);
    var samples = Assert.IsAssignableFrom<IEnumerable<SampleDto>>(okResult.Value);
    var sample = samples.FirstOrDefault();

    Assert.Single(samples);
    Assert.Equal("SMP-001", sample.SampleCode);
    Assert.Equal("Water", sample.SampleType);
}

[Fact]
public async Task GetMedia_ReturnsSeededMedia()
{
    var result = await _controller.GetMedia(1, null);
    var okResult = Assert.IsType<ActionResult<IEnumerable<PhotoVideoDto>>>(result);
    var media = Assert.IsAssignableFrom<IEnumerable<PhotoVideoDto>>(okResult.Value);
    var photo = media.FirstOrDefault();

    Assert.Single(media);
    Assert.Equal("sample1.jpg", photo.FileName);
    Assert.Equal("Photo", photo.MediaType);
}

[Fact]
public async Task GetContractualYears_ReturnsSeededYear()
{
    var result = await _controller.GetContractualYears();
    var okResult = Assert.IsType<ActionResult<IEnumerable<int>>>(result);
    var years = Assert.IsAssignableFrom<IEnumerable<int>>(okResult.Value);

    Assert.Single(years);
    Assert.Contains(2024, years);
}

[Fact]
public async Task GetSponsoringStates_ReturnsSeededState()
{
    var result = await _controller.GetSponsoringStates();
    var okResult = Assert.IsType<ActionResult<IEnumerable<string>>>(result);
    var states = Assert.IsAssignableFrom<IEnumerable<string>>(okResult.Value);

    Assert.Single(states);
    Assert.Contains("USA", states);
}

[Fact]
public async Task GetCruises_FilteredByContractorId_ReturnsCruise()
{
    var result = await _controller.GetCruises(1);
    var okResult = Assert.IsType<ActionResult<IEnumerable<CruiseDto>>>(result);
    var cruises = Assert.IsAssignableFrom<IEnumerable<CruiseDto>>(okResult.Value);

    Assert.Single(cruises);
    Assert.Equal(1, cruises.First().ContractorId);
}

[Fact]
public async Task GetSamples_FilteredBySampleType_ReturnsSample()
{
    var result = await _controller.GetSamples(null, "Water");
    var okResult = Assert.IsType<ActionResult<IEnumerable<SampleDto>>>(result);
    var samples = Assert.IsAssignableFrom<IEnumerable<SampleDto>>(okResult.Value);

    Assert.Single(samples);
    Assert.Equal("Water", samples.First().SampleType);
}

[Fact]
public async Task GetMapData_ReturnsStructuredMapData()
{
    // Act
    var result = await _controller.GetMapData(contractorId: null, null, null, null, null, null);

    var okResult = Assert.IsType<ActionResult<object>>(result);

    // Defensive check to avoid null reference exceptions
    Assert.NotNull(okResult.Value);

    // Convert anonymous object to JObject for dynamic access
    var json = JsonConvert.SerializeObject(okResult.Value);
    var data = JsonConvert.DeserializeObject<JObject>(json);

    Assert.NotNull(data);
    Assert.True(data.ContainsKey("Contractors"), "Missing 'Contractors' key");
    Assert.True(data.ContainsKey("Cruises"), "Missing 'Cruises' key");

    var contractors = (JArray)data["Contractors"];
    Assert.NotEmpty(contractors);
    Assert.Equal("Test Contractor", contractors[0]["ContractorName"]?.ToString());

    var cruises = (JArray)data["Cruises"];
    Assert.NotEmpty(cruises);
    Assert.Equal("Test Cruise", cruises[0]["CruiseName"]?.ToString());
}

[Fact]
public async Task GetAreaGeoJson_ReturnsAreaWithBlocks()
{
    var result = await _controller.GetAreaGeoJson(1);
    var okResult = Assert.IsType<ActionResult<object>>(result);
    Assert.NotNull(okResult.Value);

    var json = JsonConvert.SerializeObject(okResult.Value);
    var data = JsonConvert.DeserializeObject<JObject>(json);

    Assert.Equal(1, (int)data["areaId"]);
    Assert.Equal("Test Area", (string)data["areaName"]);
    Assert.NotNull(data["geoJson"]);

    var blocks = (JArray)data["blocks"];
    Assert.Single(blocks);
    var block = blocks.First();

    Assert.Equal("Block A", (string)block["blockName"]);
    Assert.Equal("Active", (string)block["status"]);
    Assert.NotNull(block["geoJson"]);
}

[Fact]
public async Task GetAreaGeoJson_ReturnsGeoJsonWithBlocks()
{
    var result = await _controller.GetAreaGeoJson(1);
    var okResult = Assert.IsType<ActionResult<object>>(result);

    // Serialize then deserialize into dynamic for property access
    var json = JsonConvert.SerializeObject(okResult.Value);
    dynamic data = JsonConvert.DeserializeObject<JObject>(json);

    Assert.Equal(1, (int)data["areaId"]);
    Assert.Equal("Test Area", (string)data["areaName"]);
    Assert.NotNull(data["geoJson"]);

    var blocks = data["blocks"] as JArray;
    Assert.Single(blocks);
    var block = blocks.First();

    Assert.Equal("Block A", (string)block["blockName"]);
    Assert.Equal("Active", (string)block["status"]);
    Assert.NotNull(block["geoJson"]);
}

[Fact]
public async Task GetCruises_WithInvalidContractorId_ReturnsEmpty()
{
    var result = await _controller.GetCruises(999); // no such contractor
    var okResult = Assert.IsType<ActionResult<IEnumerable<DTOs.Cruise_Dto.CruiseDto>>>(result);
    var cruises = Assert.IsAssignableFrom<IEnumerable<DTOs.Cruise_Dto.CruiseDto>>(okResult.Value);

    Assert.Empty(cruises);
}

[Fact]
public async Task GetAreaGeoJson_WithInvalidId_ReturnsNotFound()
{
    var result = await _controller.GetAreaGeoJson(999); // area doesn't exist
    Assert.IsType<NotFoundResult>(result.Result);
}

[Fact]
public async Task GetContractorAreasGeoJson_WithInvalidContractorId_ReturnsNotFound()
{
    var result = await _controller.GetContractorAreasGeoJson(999);
    Assert.IsType<NotFoundResult>(result.Result);
}

[Fact]
public async Task GetSamples_WithInvalidStationId_ReturnsEmpty()
{
    var result = await _controller.GetSamples(stationId: 999, sampleType: null);
    var samples = Assert.IsAssignableFrom<IEnumerable<DTOs.Sample_Dto.SampleDto>>(result.Value);

    Assert.Empty(samples);
}

[Fact]
public async Task GetMedia_WithInvalidSampleIdOrMediaType_ReturnsEmpty()
{
    var result = await _controller.GetMedia(sampleId: 999, mediaType: "NonexistentType");
    var media = Assert.IsAssignableFrom<IEnumerable<DTOs.PhotoVideo_Dto.PhotoVideoDto>>(result.Value);

    Assert.Empty(media);
}

[Fact]
public async Task GetCruises_FilteredByContractorId_ReturnsOnlyThatContractor()
{
    // Arrange
    var result = await _controller.GetCruises(contractorId: 1);

    // Act
    var cruises = Assert.IsAssignableFrom<IEnumerable<DTOs.Cruise_Dto.CruiseDto>>(result.Value);

    // Assert
    Assert.All(cruises, c => Assert.Equal(1, c.ContractorId));
}

[Fact]
public async Task GetSamples_FilteredBySampleType_ReturnsMatchingSamples()
{
    var result = await _controller.GetSamples(stationId: null, sampleType: "Water");
    var samples = Assert.IsAssignableFrom<IEnumerable<DTOs.Sample_Dto.SampleDto>>(result.Value);

    Assert.All(samples, s => Assert.Equal("Water", s.SampleType));
}

[Fact]
public async Task GetStations_FilteredByCruiseIdAndBounds_ReturnsOnlyMatches()
{
    var result = await _controller.GetStations(
        cruiseId: 1,
        minLat: 5.0,
        maxLat: 15.0,
        minLon: 10.0,
        maxLon: 25.0
    );

    var stations = Assert.IsAssignableFrom<IEnumerable<DTOs.Station_Dto.StationDto>>(result.Value);

    Assert.All(stations, s =>
    {
        Assert.Equal(1, s.CruiseId);
        Assert.InRange(s.Latitude, 5.0, 15.0);
        Assert.InRange(s.Longitude, 10.0, 25.0);
    });
}

[Fact]
public async Task GetMedia_FilteredByMediaType_ReturnsOnlyThatType()
{
    var result = await _controller.GetMedia(sampleId: null, mediaType: "Photo");
    var media = Assert.IsAssignableFrom<IEnumerable<DTOs.PhotoVideo_Dto.PhotoVideoDto>>(result.Value);

    Assert.All(media, m => Assert.Equal("Photo", m.MediaType));
}

[Fact]
public async Task GetContractorAreas_FilteredByContractorId_ReturnsOnlyThatContractor()
{
    var result = await _controller.GetContractorAreas(contractorId: 1);
    var areas = Assert.IsAssignableFrom<IEnumerable<DTOs.Contractors_Dto.ContractorAreaDto>>(result.Value);

    Assert.All(areas, a => Assert.Equal(1, a.ContractorId));
}

[Fact]
public async Task GetMapData_IncludesNestedSamplesAndMedia()
{
    // Act
    var result = await _controller.GetMapData(contractorId: null, null, null, null, null, null);
    var okResult = Assert.IsType<ActionResult<object>>(result);

    var json = JsonConvert.SerializeObject(okResult.Value);
    var data = JsonConvert.DeserializeObject<JObject>(json);

    // Verify top-level collections exist
    Assert.True(data.ContainsKey("Contractors"));
    Assert.True(data.ContainsKey("Cruises"));

    var cruise = data["Cruises"].First;
    var stations = (JArray)cruise["Stations"];
    Assert.NotEmpty(stations);

    var station = stations.First;
    var samples = (JArray)station["Samples"];
    Assert.NotEmpty(samples);

    var sample = samples.First;

    //   Check sample fields
    Assert.Equal("SMP-001", (string)sample["SampleCode"]);
    Assert.Equal("Water", (string)sample["SampleType"]);

    //   Check nested media
    var media = (JArray)sample["PhotoVideos"];
    Assert.NotEmpty(media);
    Assert.Equal("sample1.jpg", (string)media.First["FileName"]);

    //   Optional: Check Env or Geo results
    var envResults = (JArray)sample["EnvResults"];
    var geoResults = (JArray)sample["GeoResults"];

    Assert.NotNull(envResults);
    Assert.NotNull(geoResults);
}

[Fact]
public async Task GetContractorAreaBlocks_WithValidAreaId_ReturnsBlocks()
{
    var result = await _controller.GetContractorAreaBlocks(areaId: 1);
    var blocks = Assert.IsAssignableFrom<IEnumerable<DTOs.Contractors_Dto.ContractorAreaBlockDto>>(result.Value);

    Assert.NotEmpty(blocks);
    Assert.All(blocks, b => Assert.Equal(1, b.AreaId));
}

[Fact]
public async Task GetContractorAreaBlocks_WithInvalidAreaId_ReturnsEmpty()
{
    var result = await _controller.GetContractorAreaBlocks(areaId: 999);
    var blocks = Assert.IsAssignableFrom<IEnumerable<DTOs.Contractors_Dto.ContractorAreaBlockDto>>(result.Value);

    Assert.Empty(blocks);
}

[Fact]
public async Task GetContractStatuses_ReturnsExpectedStatuses()
{
    var result = await _controller.GetContractStatuses();
    var statuses = Assert.IsAssignableFrom<IEnumerable<DTOs.Contractors_Dto.ContractStatusDto>>(result.Value);

    Assert.NotEmpty(statuses);
}

[Fact]
public async Task GetContractTypes_ReturnsExpectedTypes()
{
    var result = await _controller.GetContractTypes();
    var types = Assert.IsAssignableFrom<IEnumerable<DTOs.Contractors_Dto.ContractTypeDto>>(result.Value);

    Assert.NotEmpty(types);
}

[Fact]
public async Task GetContractualYears_ReturnsExpectedYears()
{
    var result = await _controller.GetContractualYears();
    var years = Assert.IsAssignableFrom<IEnumerable<int>>(result.Value);

    Assert.Contains(2024, years);
}

[Fact]
public async Task GetSponsoringStates_ReturnsExpectedStates()
{
    var result = await _controller.GetSponsoringStates();
    var states = Assert.IsAssignableFrom<IEnumerable<string>>(result.Value);

    Assert.Contains("USA", states);
}

[Fact]
public async Task GetContractorAreasGeoJson_WithValidContractorId_ReturnsGeoJsonList()
{
    var result = await _controller.GetContractorAreasGeoJson(1);
    var okResult = Assert.IsType<ActionResult<object>>(result);

    var json = JsonConvert.SerializeObject(okResult.Value);
    var data = JsonConvert.DeserializeObject<JArray>(json);

    Assert.NotEmpty(data);
    Assert.Equal("Test Area", data[0]["areaName"]?.ToString());
}

[Fact]
public async Task GetMapData_WithContractorAndYearFilters_ReturnsFilteredData()
{
    var result = await _controller.GetMapData(contractorId: 1, null, null, null, year: 2024, null);
    var okResult = Assert.IsType<ActionResult<object>>(result);

    var json = JsonConvert.SerializeObject(okResult.Value);
    var data = JsonConvert.DeserializeObject<JObject>(json);

    Assert.NotNull(data["Contractors"]);
    Assert.Single((JArray)data["Contractors"]);

    var contractor = data["Contractors"].First;
    Assert.Equal("Test Contractor", (string)contractor["ContractorName"]);
    Assert.Equal(2024, (int)contractor["ContractualYear"]);
}


}