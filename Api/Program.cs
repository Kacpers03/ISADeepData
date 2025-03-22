using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Api.Data;
using Api.Repositories.Interfaces;
using Api.Repositories.Implementations;
using Api.Services.Interfaces;
using Api.Services.Implementations;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Register DbContext with SQLite using the connection string "DefaultConnection" from appsettings.json
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Register Memory Cache
builder.Services.AddMemoryCache();

// Register repositories
builder.Services.AddScoped<IMapFilterRepository, MapFilterRepository>();
builder.Services.AddScoped<ILibraryRepository, LibraryRepository>();

// Register services
builder.Services.AddScoped<IMapFilterService, MapFilterService>();
builder.Services.AddScoped<ISpatialService, SpatialService>();
builder.Services.AddScoped<ILibraryService, LibraryService>();

// Register gallery services

builder.Services.AddScoped<IGalleryRepository, GalleryRepository>();
builder.Services.AddScoped<IGalleryService, GalleryService>();

// Register Sample services
builder.Services.AddScoped<ISampleService, SampleService>();
builder.Services.AddScoped<ISampleRepository, SampleRepository>();



// Add controllers and configure API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add response caching middleware
builder.Services.AddResponseCaching(options =>
{
    options.MaximumBodySize = 1024 * 1024; // 1MB
    options.UseCaseSensitivePaths = false;
});

// Add CORS to allow frontend access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // Update with your frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
var app = builder.Build();

// Run seeding using the already built app
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<MyDbContext>();
        DbInitializer.Initialize(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine("Feil under seeding: " + ex.Message);
    }
}

// Configure middleware for development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Use CORS
app.UseCors("AllowFrontend");

// Use Response Caching
app.UseResponseCaching();

// Add cache headers middleware
app.Use(async (context, next) =>
{
    // Add cache control headers for API responses
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        context.Response.GetTypedHeaders().CacheControl = new Microsoft.Net.Http.Headers.CacheControlHeaderValue
        {
            Public = true,
            MaxAge = TimeSpan.FromMinutes(10)
        };
    }
    
    await next();
});

app.UseAuthorization();

// Map controllers
app.MapControllers();

app.Run();