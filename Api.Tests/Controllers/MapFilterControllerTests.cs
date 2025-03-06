using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using Api.Controllers;
using Api.Data;
using Models.Contractors;
using Models.Cruises;
using Models.Stations;
using Models.Samples;
using DTOs.Contractors_Dto;
using DTOs.Cruise_Dto;
using DTOs.Station_Dto;
using DTOs.Sample_Dto;

public class MapFilterControllerTests
{
    private readonly Mock<MyDbContext> _mockContext;
    private readonly MapFilterController _controller;

    public MapFilterControllerTests()
    {
        _mockContext = new Mock<MyDbContext>();
        _controller = new MapFilterController(_mockContext.Object);
    }

    [Fact]
    public async Task GetContractors_ReturnsContractors()
    {
        // Arrange
        var contractors = new List<Contractor>
        {
            new Contractor { ContractorId = 1, ContractorName = "ABC Corp" },
            new Contractor { ContractorId = 2, ContractorName = "XYZ Ltd" }
        }.AsQueryable();

        var mockSet = new Mock<DbSet<Contractor>>();
        mockSet.As<IQueryable<Contractor>>().Setup(m => m.Provider).Returns(contractors.Provider);
        mockSet.As<IQueryable<Contractor>>().Setup(m => m.Expression).Returns(contractors.Expression);
        mockSet.As<IQueryable<Contractor>>().Setup(m => m.ElementType).Returns(contractors.ElementType);
        mockSet.As<IQueryable<Contractor>>().Setup(m => m.GetEnumerator()).Returns(contractors.GetEnumerator());

        _mockContext.Setup(c => c.Contractors).Returns(mockSet.Object);

        // Act
        var result = await _controller.GetContractors();

        // Assert
        var actionResult = Assert.IsType<ActionResult<IEnumerable<ContractorDto>>>(result);
        var returnValue = Assert.IsType<List<ContractorDto>>(actionResult.Value);
        Assert.Equal(2, returnValue.Count);
    }

    [Fact]
    public async Task GetCruises_ReturnsCruises()
    {
        // Arrange
        var cruises = new List<Cruise>
        {
            new Cruise { CruiseId = 1, ContractorId = 1, CruiseName = "Exploration 1" },
            new Cruise { CruiseId = 2, ContractorId = 2, CruiseName = "Survey Alpha" }
        }.AsQueryable();

        var mockSet = new Mock<DbSet<Cruise>>();
        mockSet.As<IQueryable<Cruise>>().Setup(m => m.Provider).Returns(cruises.Provider);
        mockSet.As<IQueryable<Cruise>>().Setup(m => m.Expression).Returns(cruises.Expression);
        mockSet.As<IQueryable<Cruise>>().Setup(m => m.ElementType).Returns(cruises.ElementType);
        mockSet.As<IQueryable<Cruise>>().Setup(m => m.GetEnumerator()).Returns(cruises.GetEnumerator());

        _mockContext.Setup(c => c.Cruises).Returns(mockSet.Object);

        // Act
        var result = await _controller.GetCruises(null);

        // Assert
        var actionResult = Assert.IsType<ActionResult<IEnumerable<CruiseDto>>>(result);
        var returnValue = Assert.IsType<List<CruiseDto>>(actionResult.Value);
        Assert.Equal(2, returnValue.Count);
    }

    [Fact]
    public async Task GetStations_ReturnsStations()
    {
        // Arrange
        var stations = new List<Station>
        {
            new Station { StationId = 1, CruiseId = 1, StationCode = "ST-001", Latitude = 34.05, Longitude = -118.25 },
            new Station { StationId = 2, CruiseId = 2, StationCode = "ST-002", Latitude = 36.77, Longitude = -119.41 }
        }.AsQueryable();

        var mockSet = new Mock<DbSet<Station>>();
        mockSet.As<IQueryable<Station>>().Setup(m => m.Provider).Returns(stations.Provider);
        mockSet.As<IQueryable<Station>>().Setup(m => m.Expression).Returns(stations.Expression);
        mockSet.As<IQueryable<Station>>().Setup(m => m.ElementType).Returns(stations.ElementType);
        mockSet.As<IQueryable<Station>>().Setup(m => m.GetEnumerator()).Returns(stations.GetEnumerator());

        _mockContext.Setup(c => c.Stations).Returns(mockSet.Object);

        // Act
        var result = await _controller.GetStations(null, null, null, null, null);

        // Assert
        var actionResult = Assert.IsType<ActionResult<IEnumerable<StationDto>>>(result);
        var returnValue = Assert.IsType<List<StationDto>>(actionResult.Value);
        Assert.Equal(2, returnValue.Count);
    }

    [Fact]
    public async Task GetContractorAreaBlocks_ReturnsBlocks()
    {
        // Arrange
        var blocks = new List<ContractorAreaBlock>
        {
            new ContractorAreaBlock { BlockId = 1, AreaId = 1, BlockName = "Block A" },
            new ContractorAreaBlock { BlockId = 2, AreaId = 1, BlockName = "Block B" }
        }.AsQueryable();

        var mockSet = new Mock<DbSet<ContractorAreaBlock>>();
        mockSet.As<IQueryable<ContractorAreaBlock>>().Setup(m => m.Provider).Returns(blocks.Provider);
        mockSet.As<IQueryable<ContractorAreaBlock>>().Setup(m => m.Expression).Returns(blocks.Expression);
        mockSet.As<IQueryable<ContractorAreaBlock>>().Setup(m => m.ElementType).Returns(blocks.ElementType);
        mockSet.As<IQueryable<ContractorAreaBlock>>().Setup(m => m.GetEnumerator()).Returns(blocks.GetEnumerator());

        _mockContext.Setup(c => c.ContractorAreaBlocks).Returns(mockSet.Object);

        // Act
        var result = await _controller.GetContractorAreaBlocks(null);

        // Assert
        var actionResult = Assert.IsType<ActionResult<IEnumerable<ContractorAreaBlockDto>>>(result);
        var returnValue = Assert.IsType<List<ContractorAreaBlockDto>>(actionResult.Value);
        Assert.Equal(2, returnValue.Count);
    }

    [Fact]
    public async Task GetSponsoringStates_ReturnsStates()
    {
        // Arrange
        var contractors = new List<Contractor>
        {
            new Contractor { SponsoringState = "USA" },
            new Contractor { SponsoringState = "Canada" },
            new Contractor { SponsoringState = "Germany" }
        }.AsQueryable();

        var mockSet = new Mock<DbSet<Contractor>>();
        mockSet.As<IQueryable<Contractor>>().Setup(m => m.Provider).Returns(contractors.Provider);
        mockSet.As<IQueryable<Contractor>>().Setup(m => m.Expression).Returns(contractors.Expression);
        mockSet.As<IQueryable<Contractor>>().Setup(m => m.ElementType).Returns(contractors.ElementType);
        mockSet.As<IQueryable<Contractor>>().Setup(m => m.GetEnumerator()).Returns(contractors.GetEnumerator());

        _mockContext.Setup(c => c.Contractors).Returns(mockSet.Object);

        // Act
        var result = await _controller.GetSponsoringStates();

        // Assert
        var actionResult = Assert.IsType<ActionResult<IEnumerable<string>>>(result);
        var returnValue = Assert.IsType<List<string>>(actionResult.Value);
        Assert.Equal(3, returnValue.Count);
    }

    [Fact]
    public async Task GetContractualYears_ReturnsYears()
    {
        // Arrange
        var contractors = new List<Contractor>
        {
            new Contractor { ContractualYear = 2023 },
            new Contractor { ContractualYear = 2022 },
            new Contractor { ContractualYear = 2021 }
        }.AsQueryable();

        var mockSet = new Mock<DbSet<Contractor>>();
        mockSet.As<IQueryable<Contractor>>().Setup(m => m.Provider).Returns(contractors.Provider);
        mockSet.As<IQueryable<Contractor>>().Setup(m => m.Expression).Returns(contractors.Expression);
        mockSet.As<IQueryable<Contractor>>().Setup(m => m.ElementType).Returns(contractors.ElementType);
        mockSet.As<IQueryable<Contractor>>().Setup(m => m.GetEnumerator()).Returns(contractors.GetEnumerator());

        _mockContext.Setup(c => c.Contractors).Returns(mockSet.Object);

        // Act
        var result = await _controller.GetContractualYears();

        // Assert
        var actionResult = Assert.IsType<ActionResult<IEnumerable<int>>>(result);
        var returnValue = Assert.IsType<List<int>>(actionResult.Value);
        Assert.Equal(3, returnValue.Count);
    }
}
