using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContractStatuses",
                columns: table => new
                {
                    ContractStatusId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContractStatusName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractStatuses", x => x.ContractStatusId);
                });

            migrationBuilder.CreateTable(
                name: "ContractTypes",
                columns: table => new
                {
                    ContractTypeId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContractTypeName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractTypes", x => x.ContractTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Qualifiers",
                columns: table => new
                {
                    QualifierId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    QualifierCode = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    QualifierDefinition = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Qualifiers", x => x.QualifierId);
                });

            migrationBuilder.CreateTable(
                name: "ValidValues",
                columns: table => new
                {
                    ValueId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FieldName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    ValidValueName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValidValues", x => x.ValueId);
                });

            migrationBuilder.CreateTable(
                name: "Contractors",
                columns: table => new
                {
                    ContractorId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContractorName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    ContractTypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    ContractNumber = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    SponsoringState = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    ContractStatusId = table.Column<int>(type: "INTEGER", nullable: false),
                    ContractualYear = table.Column<int>(type: "INTEGER", nullable: false),
                    Remarks = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contractors", x => x.ContractorId);
                    table.ForeignKey(
                        name: "FK_Contractors_ContractStatuses_ContractStatusId",
                        column: x => x.ContractStatusId,
                        principalTable: "ContractStatuses",
                        principalColumn: "ContractStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Contractors_ContractTypes_ContractTypeId",
                        column: x => x.ContractTypeId,
                        principalTable: "ContractTypes",
                        principalColumn: "ContractTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ContractorAreas",
                columns: table => new
                {
                    AreaId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContractorId = table.Column<int>(type: "INTEGER", nullable: false),
                    AreaName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    AreaDescription = table.Column<string>(type: "TEXT", nullable: false),
                    GeoJsonBoundary = table.Column<string>(type: "TEXT", nullable: false),
                    CenterLatitude = table.Column<double>(type: "REAL", nullable: false),
                    CenterLongitude = table.Column<double>(type: "REAL", nullable: false),
                    TotalAreaSizeKm2 = table.Column<double>(type: "REAL", nullable: false),
                    AllocationDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractorAreas", x => x.AreaId);
                    table.ForeignKey(
                        name: "FK_ContractorAreas_Contractors_ContractorId",
                        column: x => x.ContractorId,
                        principalTable: "Contractors",
                        principalColumn: "ContractorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cruises",
                columns: table => new
                {
                    CruiseId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContractorId = table.Column<int>(type: "INTEGER", nullable: false),
                    CruiseName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    ResearchVessel = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cruises", x => x.CruiseId);
                    table.ForeignKey(
                        name: "FK_Cruises_Contractors_ContractorId",
                        column: x => x.ContractorId,
                        principalTable: "Contractors",
                        principalColumn: "ContractorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Libraries",
                columns: table => new
                {
                    LibraryId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContractorId = table.Column<int>(type: "INTEGER", nullable: false),
                    Theme = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    FileName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    SubmissionDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsConfidential = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Libraries", x => x.LibraryId);
                    table.ForeignKey(
                        name: "FK_Libraries_Contractors_ContractorId",
                        column: x => x.ContractorId,
                        principalTable: "Contractors",
                        principalColumn: "ContractorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContractorAreaBlocks",
                columns: table => new
                {
                    BlockId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AreaId = table.Column<int>(type: "INTEGER", nullable: false),
                    BlockName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    BlockDescription = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    GeoJsonBoundary = table.Column<string>(type: "TEXT", nullable: false),
                    CenterLatitude = table.Column<double>(type: "REAL", nullable: false),
                    CenterLongitude = table.Column<double>(type: "REAL", nullable: false),
                    AreaSizeKm2 = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractorAreaBlocks", x => x.BlockId);
                    table.ForeignKey(
                        name: "FK_ContractorAreaBlocks_ContractorAreas_AreaId",
                        column: x => x.AreaId,
                        principalTable: "ContractorAreas",
                        principalColumn: "AreaId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stations",
                columns: table => new
                {
                    StationId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CruiseId = table.Column<int>(type: "INTEGER", nullable: false),
                    StationCode = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    StationType = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Latitude = table.Column<double>(type: "REAL", nullable: false),
                    Longitude = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stations", x => x.StationId);
                    table.ForeignKey(
                        name: "FK_Stations_Cruises_CruiseId",
                        column: x => x.CruiseId,
                        principalTable: "Cruises",
                        principalColumn: "CruiseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CtdDataSet",
                columns: table => new
                {
                    CtdId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StationId = table.Column<int>(type: "INTEGER", nullable: false),
                    DepthM = table.Column<double>(type: "REAL", nullable: false),
                    TemperatureC = table.Column<double>(type: "REAL", nullable: false),
                    Salinity = table.Column<double>(type: "REAL", nullable: false),
                    Oxygen = table.Column<double>(type: "REAL", nullable: false),
                    Ph = table.Column<double>(type: "REAL", nullable: false),
                    MeasurementTime = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CtdDataSet", x => x.CtdId);
                    table.CheckConstraint("CK_CTD_Oxygen", "[Oxygen] >= 0 AND [Oxygen] <= 20");
                    table.CheckConstraint("CK_CTD_Ph", "[Ph] >= 0 AND [Ph] <= 14");
                    table.CheckConstraint("CK_CTD_Salinity", "[Salinity] >= 0 AND [Salinity] <= 60");
                    table.CheckConstraint("CK_CTD_Temperature", "[TemperatureC] >= -5 AND [TemperatureC] <= 40");
                    table.ForeignKey(
                        name: "FK_CtdDataSet_Stations_StationId",
                        column: x => x.StationId,
                        principalTable: "Stations",
                        principalColumn: "StationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Samples",
                columns: table => new
                {
                    SampleId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StationId = table.Column<int>(type: "INTEGER", nullable: false),
                    SampleCode = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    SampleType = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    MatrixType = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    HabitatType = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    SamplingDevice = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    DepthLower = table.Column<double>(type: "REAL", nullable: false),
                    DepthUpper = table.Column<double>(type: "REAL", nullable: false),
                    SampleDescription = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Samples", x => x.SampleId);
                    table.CheckConstraint("CK_Sample_Depth", "[DepthUpper] > [DepthLower]");
                    table.ForeignKey(
                        name: "FK_Samples_Stations_StationId",
                        column: x => x.StationId,
                        principalTable: "Stations",
                        principalColumn: "StationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EnvResults",
                columns: table => new
                {
                    EnvResultId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SampleId = table.Column<int>(type: "INTEGER", nullable: false),
                    AnalysisCategory = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    AnalysisName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    AnalysisValue = table.Column<double>(type: "REAL", nullable: false),
                    Units = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Remarks = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnvResults", x => x.EnvResultId);
                    table.ForeignKey(
                        name: "FK_EnvResults_Samples_SampleId",
                        column: x => x.SampleId,
                        principalTable: "Samples",
                        principalColumn: "SampleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GeoResults",
                columns: table => new
                {
                    GeoResultId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SampleId = table.Column<int>(type: "INTEGER", nullable: false),
                    Category = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Analysis = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Value = table.Column<double>(type: "REAL", nullable: false),
                    Units = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Qualifier = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Remarks = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GeoResults", x => x.GeoResultId);
                    table.ForeignKey(
                        name: "FK_GeoResults_Samples_SampleId",
                        column: x => x.SampleId,
                        principalTable: "Samples",
                        principalColumn: "SampleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhotoVideos",
                columns: table => new
                {
                    MediaId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SampleId = table.Column<int>(type: "INTEGER", nullable: false),
                    FileName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    MediaType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CameraSpecs = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    CaptureDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Remarks = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhotoVideos", x => x.MediaId);
                    table.ForeignKey(
                        name: "FK_PhotoVideos_Samples_SampleId",
                        column: x => x.SampleId,
                        principalTable: "Samples",
                        principalColumn: "SampleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContractorAreaBlocks_AreaId",
                table: "ContractorAreaBlocks",
                column: "AreaId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractorAreas_ContractorId",
                table: "ContractorAreas",
                column: "ContractorId");

            migrationBuilder.CreateIndex(
                name: "IX_Contractors_ContractStatusId",
                table: "Contractors",
                column: "ContractStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Contractors_ContractTypeId",
                table: "Contractors",
                column: "ContractTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Cruises_ContractorId",
                table: "Cruises",
                column: "ContractorId");

            migrationBuilder.CreateIndex(
                name: "IX_CtdDataSet_StationId",
                table: "CtdDataSet",
                column: "StationId");

            migrationBuilder.CreateIndex(
                name: "IX_EnvResults_SampleId",
                table: "EnvResults",
                column: "SampleId");

            migrationBuilder.CreateIndex(
                name: "IX_GeoResults_SampleId",
                table: "GeoResults",
                column: "SampleId");

            migrationBuilder.CreateIndex(
                name: "IX_Libraries_ContractorId",
                table: "Libraries",
                column: "ContractorId");

            migrationBuilder.CreateIndex(
                name: "IX_PhotoVideos_SampleId",
                table: "PhotoVideos",
                column: "SampleId");

            migrationBuilder.CreateIndex(
                name: "IX_Samples_StationId",
                table: "Samples",
                column: "StationId");

            migrationBuilder.CreateIndex(
                name: "IX_Stations_CruiseId",
                table: "Stations",
                column: "CruiseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContractorAreaBlocks");

            migrationBuilder.DropTable(
                name: "CtdDataSet");

            migrationBuilder.DropTable(
                name: "EnvResults");

            migrationBuilder.DropTable(
                name: "GeoResults");

            migrationBuilder.DropTable(
                name: "Libraries");

            migrationBuilder.DropTable(
                name: "PhotoVideos");

            migrationBuilder.DropTable(
                name: "Qualifiers");

            migrationBuilder.DropTable(
                name: "ValidValues");

            migrationBuilder.DropTable(
                name: "ContractorAreas");

            migrationBuilder.DropTable(
                name: "Samples");

            migrationBuilder.DropTable(
                name: "Stations");

            migrationBuilder.DropTable(
                name: "Cruises");

            migrationBuilder.DropTable(
                name: "Contractors");

            migrationBuilder.DropTable(
                name: "ContractStatuses");

            migrationBuilder.DropTable(
                name: "ContractTypes");
        }
    }
}
