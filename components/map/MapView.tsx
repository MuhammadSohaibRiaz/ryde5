'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { User } from 'lucide-react';
import Link from 'next/link';
import { MAPS_CONFIG } from '@/config/constants';
import type { Location, RouteDetails } from '@/types';
import { calculateFare } from '@/lib/utils';

interface MapViewProps {
  pickup?: Location | null;
  dropoff?: Location | null;
  driverLocation?: { lat: number; lng: number } | null;
  onRouteCalculated?: (details: RouteDetails) => void;
  selectionMode?: boolean;
  onLocationSelect?: (location: Location) => void;
}

export default function MapView({
  pickup,
  dropoff,
  driverLocation,
  onRouteCalculated,
  selectionMode = false,
  onLocationSelect,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<{
    pickup?: google.maps.Marker;
    dropoff?: google.maps.Marker;
    driver?: google.maps.Marker;
    selection?: google.maps.Marker;
  }>({});
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapLoaded) return;

    const loader = new Loader({
      apiKey: MAPS_CONFIG.apiKey,
      version: 'weekly',
      libraries: MAPS_CONFIG.libraries,
    });

    loader.load().then((google) => {
      const mapInstance = new google.maps.Map(mapRef.current!, {
        center: MAPS_CONFIG.defaultCenter,
        zoom: MAPS_CONFIG.defaultZoom,
        ...MAPS_CONFIG.mapOptions,
        disableDefaultUI: selectionMode,
      });

      if (!selectionMode) {
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map: mapInstance,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#FFA500',
            strokeWeight: 4,
          },
        });
      }

      // Selection mode marker
      if (selectionMode) {
        const marker = new google.maps.Marker({
          map: mapInstance,
          position: mapInstance.getCenter(),
          icon: {
            url: '/marker.png',
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 40),
          },
        });

        markersRef.current.selection = marker;

        mapInstance.addListener('center_changed', () => {
          marker.setPosition(mapInstance.getCenter());
        });

        mapInstance.addListener('idle', () => {
          const center = mapInstance.getCenter();
          if (center && onLocationSelect) {
            reverseGeocode(center);
          }
        });
      }

      setMap(mapInstance);
      setMapLoaded(true);

      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            mapInstance.setCenter(pos);
            if (selectionMode && markersRef.current.selection) {
              markersRef.current.selection.setPosition(pos);
            }
          },
          () => {
            console.warn('Geolocation failed');
          }
        );
      }
    });

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker?.setMap(null));
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
    };
  }, [mapLoaded, selectionMode, onLocationSelect]);

  // Reverse geocode function
  const reverseGeocode = useCallback(
    (latLng: google.maps.LatLng) => {
      if (!map || !onLocationSelect) return;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          onLocationSelect({
            address: results[0].formatted_address,
            coordinates: {
              lat: latLng.lat(),
              lng: latLng.lng(),
            },
          });
        }
      });
    },
    [map, onLocationSelect]
  );

  // Update pickup marker
  useEffect(() => {
    if (!map || !pickup) return;

    if (markersRef.current.pickup) {
      markersRef.current.pickup.setMap(null);
    }

    markersRef.current.pickup = new google.maps.Marker({
      map,
      position: pickup.coordinates,
      icon: {
        url: '/marker.png',
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40),
      },
      title: 'Pickup Location',
    });
  }, [map, pickup]);

  // Update dropoff marker
  useEffect(() => {
    if (!map || !dropoff) return;

    if (markersRef.current.dropoff) {
      markersRef.current.dropoff.setMap(null);
    }

    markersRef.current.dropoff = new google.maps.Marker({
      map,
      position: dropoff.coordinates,
      icon: {
        url: '/marker.png',
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40),
      },
      title: 'Dropoff Location',
    });
  }, [map, dropoff]);

  // Calculate and display route
  useEffect(() => {
    if (!map || !pickup || !dropoff || !directionsRendererRef.current) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: pickup.coordinates,
        destination: dropoff.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRendererRef.current!.setDirections(result);

          const route = result.routes[0];
          const leg = route.legs[0];
          
          if (onRouteCalculated) {
            onRouteCalculated({
              distance: leg.distance?.text || '',
              duration: leg.duration?.text || '',
              fare: calculateFare(leg.distance?.value || 0),
              pickupEta: Math.ceil((leg.duration?.value || 0) / 60 * 0.3),
            });
          }
        }
      }
    );
  }, [map, pickup, dropoff, onRouteCalculated]);

  // Update driver marker
  useEffect(() => {
    if (!map || !driverLocation) return;

    if (!markersRef.current.driver) {
      markersRef.current.driver = new google.maps.Marker({
        map,
        icon: {
          url: 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop',
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        },
        title: 'Driver Location',
      });
    }

    markersRef.current.driver.setPosition(driverLocation);
  }, [map, driverLocation]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full map-container" />

      {/* User Profile Quick Access */}
      {!selectionMode && (
        <Link
          href="/profile"
          className="absolute top-4 right-4 z-30 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <User className="w-6 h-6 text-gray-700" />
        </Link>
      )}
    </div>
  );
}