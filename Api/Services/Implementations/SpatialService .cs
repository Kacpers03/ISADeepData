using System;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Services.Interfaces;
using Models.Stations;

namespace Api.Services.Implementations
{
    public class SpatialService : ISpatialService
    {
        private readonly MyDbContext _context;

        public SpatialService(MyDbContext context)
        {
            _context = context;
        }

        public bool IsPointInPolygon(double lat, double lon, string geoJsonPolygon)
        {
            try
            {
                // Parse GeoJSON
                var geoJson = JsonDocument.Parse(geoJsonPolygon);
                var coordinatesElement = geoJson.RootElement
                    .GetProperty("geometry")
                    .GetProperty("coordinates");
                
                // Fortsett bare hvis vi har en polygon
                if (geoJson.RootElement.GetProperty("geometry").GetProperty("type").GetString() != "Polygon")
                    return false;

                // Hent polygonkoordinater
                var polygonCoordinates = new List<(double Lon, double Lat)>();
                var outerRing = coordinatesElement[0]; // Første koordinatarray er ytterringen
                
                for (int i = 0; i < outerRing.GetArrayLength(); i++)
                {
                    var point = outerRing[i];
                    polygonCoordinates.Add((point[0].GetDouble(), point[1].GetDouble()));
                }
                
                // Implementer punkt-i-polygon-algoritmen
                return IsPointInPolygon(lat, lon, polygonCoordinates);
            }
            catch (Exception)
            {
                return false;
            }
        }
        
        public double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            // Implementer haversine-formelen for avstandsberegning
            const double EarthRadiusKm = 6371.0;
            
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);
            
            var a = Math.Sin(dLat/2) * Math.Sin(dLat/2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon/2) * Math.Sin(dLon/2);
                    
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1-a));
            return EarthRadiusKm * c;
        }
        
        public async Task<int?> FindBlockIdForCoordinates(double lat, double lon)
        {
            var blocks = await _context.ContractorAreaBlocks.ToListAsync();
            
            foreach (var block in blocks)
            {
                if (string.IsNullOrEmpty(block.GeoJsonBoundary))
                    continue;
                    
                if (IsPointInPolygon(lat, lon, block.GeoJsonBoundary))
                {
                    return block.BlockId;
                }
            }
            
            return null;
        }
        
        public async Task<bool> AssociateStationsWithBlocks()
        {
            try
            {
                var stations = await _context.Stations.ToListAsync();
                var updated = 0;
                
                foreach (var station in stations)
                {
                    var blockId = await FindBlockIdForCoordinates(station.Latitude, station.Longitude);
                    if (blockId.HasValue)
                    {
                        station.ContractorAreaBlockId = blockId.Value;
                        updated++;
                    }
                }
                
                if (updated > 0)
                {
                    await _context.SaveChangesAsync();
                }
                
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        
        private double ToRadians(double degrees)
        {
            return degrees * Math.PI / 180.0;
        }
        
        private bool IsPointInPolygon(double lat, double lon, List<(double Lon, double Lat)> polygonCoordinates)
        {
            // Implementer ray casting-algoritmen (even-odd rule)
            int i, j;
            bool result = false;
            for (i = 0, j = polygonCoordinates.Count - 1; i < polygonCoordinates.Count; j = i++)
            {
                if ((polygonCoordinates[i].Lat > lat) != (polygonCoordinates[j].Lat > lat) &&
                    (lon < (polygonCoordinates[j].Lon - polygonCoordinates[i].Lon) * (lat - polygonCoordinates[i].Lat) / 
                    (polygonCoordinates[j].Lat - polygonCoordinates[i].Lat) + polygonCoordinates[i].Lon))
                {
                    result = !result;
                }
            }
            return result;
        }
    }
}