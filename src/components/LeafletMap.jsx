import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix default leaflet marker icon issue with bundlers
const lostIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const foundIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LeafletMap = ({
  items = [],
  center = [17.4475, 78.3762], // Default: Hyderabad HITEC
  zoom = 12,
  interactiveSelection = false,
  selectedCoord = null,
  onSelectCoord = null
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const selectMarkerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);

      if (interactiveSelection) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          if (onSelectCoord) {
            onSelectCoord({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
          }
        });
      }

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update selected coordinate marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (interactiveSelection && selectedCoord?.lat && selectedCoord?.lng) {
      if (selectMarkerRef.current) {
        selectMarkerRef.current.setLatLng([selectedCoord.lat, selectedCoord.lng]);
      } else {
        selectMarkerRef.current = L.marker([selectedCoord.lat, selectedCoord.lng], { icon: selectIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup('<b>Selected Location</b>')
          .openPopup();
      }
      mapInstanceRef.current.panTo([selectedCoord.lat, selectedCoord.lng]);
    }
  }, [selectedCoord, interactiveSelection]);

  // Update Item Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const bounds = L.latLngBounds([]);
    let hasCoords = false;

    items.forEach((item) => {
      if (item.latitude && item.longitude) {
        const lat = parseFloat(item.latitude);
        const lng = parseFloat(item.longitude);
        const isLost = item.type === 'lost' || !item.found_location;
        const icon = isLost ? lostIcon : foundIcon;

        const popupContent = `
          <div style="min-width: 160px; font-family: sans-serif;">
            <div style="font-size: 11px; font-weight: 700; color: ${isLost ? '#e11d48' : '#059669'}; text-transform: uppercase;">
              ${isLost ? 'Lost Item' : 'Found Item'}
            </div>
            <div style="font-weight: 700; font-size: 13px; margin: 4px 0;">${item.item_name}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">📍 ${item.location || item.found_location || ''}</div>
            ${item.distance_km !== undefined && item.distance_km !== null ? `<div style="font-size: 11px; font-weight: 600; color: #0284c7;">📏 ~${item.distance_km} km away</div>` : ''}
            <a href="/items/${isLost ? 'lost' : 'found'}/${item.id}" style="display: block; margin-top: 8px; padding: 4px 8px; background: #0c85eb; color: #fff; font-size: 11px; font-weight: 600; text-align: center; border-radius: 6px; text-decoration: none;">
              View Details
            </a>
          </div>
        `;

        const marker = L.marker([lat, lng], { icon }).bindPopup(popupContent);
        markersLayerRef.current.addLayer(marker);
        bounds.extend([lat, lng]);
        hasCoords = true;
      }
    });

    if (hasCoords && bounds.isValid() && !interactiveSelection) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [items, interactiveSelection]);

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px]" />
    </div>
  );
};

export default LeafletMap;
