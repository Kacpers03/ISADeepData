using System;
using System.Collections.Generic;
using System.Text.Json;

namespace Api.Helpers
{
    public static class GeoJsonHelper
    {
        public static string GenerateRectangleGeoJson(
            double minLat, 
            double minLon, 
            double maxLat, 
            double maxLon, 
            Dictionary<string, object>? properties = null)
        {
            var coordinates = new List<List<double[]>>
            {
                new List<double[]>
                {
                    new double[] { minLon, minLat },
                    new double[] { maxLon, minLat },
                    new double[] { maxLon, maxLat },
                    new double[] { minLon, maxLat },
                    new double[] { minLon, minLat }
                }
            };

            var geoJson = new
            {
                type = "Feature",
                properties = properties ?? new Dictionary<string, object>(),
                geometry = new
                {
                    type = "Polygon",
                    coordinates
                }
            };

            return JsonSerializer.Serialize(geoJson);
        }
        
        public static string GenerateContractorBlockGeoJson(
            double minLat, 
            double minLon, 
            double maxLat, 
            double maxLon,
            string blockName,
            string status,
            string? category = null,
            double? resourceDensity = null,
            int blockId = 0)
        {
            var properties = new Dictionary<string, object>
            {
                { "blockId", blockId },
                { "name", blockName },
                { "status", status }
            };
            
            if (!string.IsNullOrEmpty(category))
            {
                properties.Add("category", category);
            }
            
            if (resourceDensity.HasValue)
            {
                properties.Add("resourceDensity", resourceDensity.Value);
            }
            
            return GenerateRectangleGeoJson(minLat, minLon, maxLat, maxLon, properties);
        }
        
        public static string GeneratePointGeoJson(
            double lat, 
            double lon, 
            Dictionary<string, object>? properties = null)
        {
            var geoJson = new
            {
                type = "Feature",
                properties = properties ?? new Dictionary<string, object>(),
                geometry = new
                {
                    type = "Point",
                    coordinates = new double[] { lon, lat }
                }
            };

            return JsonSerializer.Serialize(geoJson);
        }
    }
}