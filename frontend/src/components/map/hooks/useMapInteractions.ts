// frontend/src/components/map/hooks/useMapInteractions.ts
import { useCallback } from 'react';

/**
 * Custom hook for map interactions and event handlers
 */
const useMapInteractions = ({
  mapRef,
  viewState,
  setViewState,
  setUserHasSetView,
  setViewBounds,
  updateClusters,
  setSelectedCruiseId,
  setDetailPanelType,
  setShowDetailPanel,
  setPopupInfo,
  setSelectedStation,
  zoomToCruise,
  zoomToArea,
  zoomToBlock,
  setShowCruises,
  resetFilters,
  fetchBlockAnalytics,
  blockAnalytics,
  setBlockAnalytics,
  visibleAreaLayers,
  selectedContractorId,
  contractorSummary,
  setContractorSummary,
  fetchContractorSummary,
  setToastMessage,
  setShowToast
}) => {
  // Handle view state change
  const handleViewStateChange = useCallback((evt) => {
    setViewState(evt.viewState);
    // User has manually changed the view
    setUserHasSetView(true);
    
    // Update view bounds for future API requests
    if (mapRef.current) {
      const bounds = mapRef.current.getMap().getBounds();
      setViewBounds({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLon: bounds.getWest(),
        maxLon: bounds.getEast()
      });
    }
    
    // Update clusters when view changes
    updateClusters(evt.viewState);
  }, [mapRef, setViewState, setUserHasSetView, setViewBounds, updateClusters]);
  
  // Handle cruise click - IMPROVED VERSION
  const handleCruiseClick = useCallback((cruise) => {
    console.log("Cruise clicked:", cruise.cruiseName);
    
    // First ensure cruises are visible
    setShowCruises(true);
    
    // Set selected cruise ID
    setSelectedCruiseId(cruise.cruiseId);
    
    // Zoom to the cruise immediately (don't wait for effect)
    if (mapRef.current && cruise) {
      // Direct zoom call instead of waiting for effect
      zoomToCruise(cruise, setShowCruises);
    }
    
    // Show detail panel after a small delay to ensure zoom happens first
    setTimeout(() => {
      setDetailPanelType('cruise');
      setShowDetailPanel(true);
      setPopupInfo(null); // Close any open popups
    }, 100);
  }, [
    setSelectedCruiseId, 
    setDetailPanelType, 
    setShowDetailPanel, 
    setPopupInfo, 
    setShowCruises, 
    zoomToCruise,
    mapRef
  ]);
  
  // Handle marker (station) click
  const handleMarkerClick = useCallback((station) => {
    setSelectedStation(station);
    setDetailPanelType('station');
    setShowDetailPanel(true);
    setPopupInfo(null); // Close any open popup
  }, [setSelectedStation, setDetailPanelType, setShowDetailPanel, setPopupInfo]);
  
  // Handle panel close
  const handlePanelClose = useCallback(() => {
    // Only reset the UI state, but keep the contractor summary data
    setShowDetailPanel(false);
    setDetailPanelType(null);
    
    // Only reset station selection, keep contractor selection and data
    setSelectedStation(null);
    
    // Only reset block analytics
    setBlockAnalytics(null);
  }, [setShowDetailPanel, setDetailPanelType, setSelectedStation, setBlockAnalytics]);

  // Handle close all panels
  const handleCloseAllPanels = useCallback(() => {
    // Close the detail panel
    setShowDetailPanel(false);
    setDetailPanelType(null);
    
    // Reset selected items
    setSelectedStation(null);
    
    // Reset analytics data but don't clear selection
    setBlockAnalytics(null);
    setContractorSummary(null);
  }, [setShowDetailPanel, setDetailPanelType, setSelectedStation, setBlockAnalytics, setContractorSummary]);

  // View contractor summary
  const handleViewContractorSummary = useCallback(() => {
    if (selectedContractorId && contractorSummary) {
      setDetailPanelType('contractorSummary');
      setShowDetailPanel(true);
    } else if (selectedContractorId) {
      // If we have the ID but no summary, fetch it first
      fetchContractorSummary(
        selectedContractorId, 
        setContractorSummary, 
        setToastMessage, 
        setShowToast
      ).then((summary) => {
        if (summary) {
          setDetailPanelType('contractorSummary');
          setShowDetailPanel(true);
        }
      });
    }
  }, [
    selectedContractorId, 
    contractorSummary, 
    fetchContractorSummary, 
    setDetailPanelType, 
    setShowDetailPanel,
    setContractorSummary,
    setToastMessage,
    setShowToast
  ]);
  
  // Handle reset filters with smart zooming
  const handleResetFilters = useCallback(() => {
    resetFilters();
    setUserHasSetView(false); // Allow auto-zooming after reset
    // The global view zoom will be handled by the smartZoom effect
  }, [resetFilters, setUserHasSetView]);

  // Handle block click
  const handleBlockClick = useCallback((blockId) => {
    fetchBlockAnalytics(
      blockId, 
      setBlockAnalytics, 
      setDetailPanelType, 
      setShowDetailPanel, 
      zoomToBlock, 
      visibleAreaLayers, 
      setToastMessage, 
      setShowToast
    );
  }, [
    fetchBlockAnalytics, 
    setBlockAnalytics, 
    setDetailPanelType, 
    setShowDetailPanel, 
    zoomToBlock, 
    visibleAreaLayers, 
    setToastMessage, 
    setShowToast
  ]);
  
  // Handle hover on map features
  const handleMapHover = useCallback((e) => {
    if (!mapRef.current) return;
    
    const map = mapRef.current.getMap();
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['block-fill']
    });
    
    // Set cursor based on hovering over interactive elements
    if (features.length > 0) {
      map.getCanvas().style.cursor = 'pointer';
    } else {
      map.getCanvas().style.cursor = '';
    }
  }, [mapRef]);
  
  // Handle area click for zooming to area
  const handleAreaClick = useCallback((areaId) => {
    if (!visibleAreaLayers) return;
    
    const area = visibleAreaLayers.find(a => a.areaId === areaId);
    if (area) {
      zoomToArea(area);
    }
  }, [visibleAreaLayers, zoomToArea]);
  
  // Handle station popup
  const handleStationHover = useCallback((station, show) => {
    if (show) {
      setPopupInfo(station);
    } else if (setPopupInfo) {
      setPopupInfo(null);
    }
  }, [setPopupInfo]);
  
  // Toggle display of map summary panel
  const toggleSummaryPanel = useCallback((show) => {
    setShowDetailPanel(!show); // Hide detail panel when showing summary
  }, [setShowDetailPanel]);
  
  return {
    handleViewStateChange,
    handleCruiseClick,
    handleMarkerClick,
    handlePanelClose,
    handleCloseAllPanels,
    handleViewContractorSummary,
    handleResetFilters,
    handleBlockClick,
    handleMapHover,
    handleAreaClick,
    handleStationHover,
    toggleSummaryPanel
  };
};

export default useMapInteractions;