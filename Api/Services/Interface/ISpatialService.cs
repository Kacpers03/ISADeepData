using System.Threading.Tasks;

namespace Api.Services.Interfaces
{
    public interface ISpatialService
    {
        bool IsPointInPolygon(double lat, double lon, string geoJsonPolygon);
        double CalculateDistance(double lat1, double lon1, double lat2, double lon2);
        Task<int?> FindBlockIdForCoordinates(double lat, double lon);
        Task<bool> AssociateStationsWithBlocks();
    }
}