using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Repositories.Interfaces;
using Api.Repositories.Implementations;
using Api.Services.Interfaces;
using Api.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Register DbContext with SQLite and get connection string "DefaultConnection" from appsettings.json
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Register repositories
builder.Services.AddScoped<IMapFilterRepository, MapFilterRepository>();

// Register services
builder.Services.AddScoped<IMapFilterService, MapFilterService>();

// Add controllers and configure API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS to allow frontend to access the API
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

app.UseAuthorization();

// Map controllers
app.MapControllers();

app.Run();