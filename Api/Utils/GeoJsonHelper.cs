using System;
using System.Collections.Generic;
using System.Text.Json;

namespace Api.Helpers
{
    public static class GeoJsonHelper
    {
        public static string GenerateRectangleGeoJson(double minLat, double minLon, double maxLat, double maxLon)
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
                properties = new { },
                geometry = new
                {
                    type = "Polygon",
                    coordinates
                }
            };

            return JsonSerializer.Serialize(geoJson);
        }
        
        public static string GeneratePolygonGeoJson(List<(double lat, double lon)> points)
        {
            var coordinateList = new List<double[]>();
            
            foreach (var point in points)
            {
                coordinateList.Add(new double[] { point.lon, point.lat });
            }
            
            // Lukk polygonet ved å legge til første punkt på slutten
            if (coordinateList.Count > 0)
            {
                coordinateList.Add(new double[] { points[0].lon, points[0].lat });
            }
            
            var coordinates = new List<List<double[]>> { coordinateList };

            var geoJson = new
            {
                type = "Feature",
                properties = new { },
                geometry = new
                {
                    type = "Polygon",
                    coordinates
                }
            };

            return JsonSerializer.Serialize(geoJson);
        }
    }
}