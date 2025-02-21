using Microsoft.EntityFrameworkCore;
using Api.Data;  // Endre til riktig namespace for din DbContext

var builder = WebApplication.CreateBuilder(args);

// Registrer DbContext med SQLite og hent tilkoblingsstrengen "DefaultConnection" fra appsettings.json
builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Legg til andre nødvendige tjenester
builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Konfigurer middleware for utviklingsmiljø
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

// Standard rute for MVC
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
