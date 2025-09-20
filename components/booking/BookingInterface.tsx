'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOKING_STATES } from '@/config/constants';
import type { BookingState, Location, RouteDetails, Driver } from '@/types';
import MapView from '@/components/map/MapView';
import LocationSelector from './LocationSelector';
import RideConfirmation from './RideConfirmation';
import DriverSearch from './DriverSearch';
import DriverTracking from './DriverTracking';

export default function BookingInterface() {
  const [bookingState, setBookingState] = useState<BookingState>({
    pickup: null,
    dropoff: null,
    selectedDriver: null,
    routeDetails: null,
    status: BOOKING_STATES.INITIAL,
  });

  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff' | null>(null);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationSelect = useCallback((location: Location) => {
    if (activeInput === 'pickup') {
      setBookingState(prev => ({
        ...prev,
        pickup: location,
      }));
    } else if (activeInput === 'dropoff') {
      setBookingState(prev => ({
        ...prev,
        dropoff: location,
      }));
    }

    setActiveInput(null);
    
    // If both locations are set, move to confirmation
    if (bookingState.pickup && activeInput === 'dropoff') {
      setBookingState(prev => ({
        ...prev,
        status: BOOKING_STATES.CONFIRMING_LOCATIONS,
      }));
    } else if (bookingState.dropoff && activeInput === 'pickup') {
      setBookingState(prev => ({
        ...prev,
        status: BOOKING_STATES.CONFIRMING_LOCATIONS,
      }));
    } else {
      setBookingState(prev => ({
        ...prev,
        status: BOOKING_STATES.INITIAL,
      }));
    }
  }, [activeInput, bookingState.pickup, bookingState.dropoff]);

  const handleRouteCalculated = useCallback((details: RouteDetails) => {
    setBookingState(prev => ({
      ...prev,
      routeDetails: details,
    }));
  }, []);

  const handleRequestRide = useCallback(() => {
    setBookingState(prev => ({
      ...prev,
      status: BOOKING_STATES.FINDING_DRIVERS,
    }));

    // Simulate driver search
    setTimeout(() => {
      const mockDriver: Driver = {
        id: 'driver-1',
        name: 'Michael Johnson',
        email: 'michael@example.com',
        phone: '+1234567890',
        rating: 4.9,
        ridesCompleted: 2543,
        favoriteLocations: [],
        paymentMethods: [],
        rideHistory: [],
        emergencyContacts: [],
        twoFactorEnabled: false,
        status: 'active',
        vehicle: {
          make: 'Tesla',
          model: 'Model 3',
          year: 2023,
          color: 'White',
          licensePlate: 'ABC 123',
          insurance: {
            provider: 'SafeAuto',
            policyNumber: 'SA123456789',
            expiryDate: '2025-12-31',
          },
        },
        documents: [],
        earnings: {
          total: 0,
          lastWeek: 0,
          currentWeek: 0,
          pending: 0,
          stats: {
            totalTrips: 2543,
            averageRating: 4.9,
            completionRate: 98,
            cancellationRate: 2,
          },
        },
        schedule: {},
        performance: {
          rating: 4.9,
          acceptance: 95,
          completion: 98,
        },
      };

      setBookingState(prev => ({
        ...prev,
        selectedDriver: mockDriver,
        status: BOOKING_STATES.DRIVER_FOUND,
      }));

      setTimeout(() => {
        setBookingState(prev => ({
          ...prev,
          status: BOOKING_STATES.DRIVER_ACCEPTED,
        }));

        // Set initial driver location
        if (bookingState.pickup) {
          const startLocation = {
            lat: bookingState.pickup.coordinates.lat + (Math.random() - 0.5) * 0.01,
            lng: bookingState.pickup.coordinates.lng + (Math.random() - 0.5) * 0.01,
          };
          setDriverLocation(startLocation);
          
          setBookingState(prev => ({
            ...prev,
            status: BOOKING_STATES.DRIVER_ARRIVING,
          }));
        }
      }, 2000);
    }, 3000);
  }, [bookingState.pickup]);

  const handleCancelRide = useCallback(() => {
    setBookingState({
      pickup: null,
      dropoff: null,
      selectedDriver: null,
      routeDetails: null,
      status: BOOKING_STATES.INITIAL,
    });
    setDriverLocation(null);
    setActiveInput(null);
  }, []);

  const handleEditLocation = useCallback((type: 'pickup' | 'dropoff') => {
    setActiveInput(type);
    setBookingState(prev => ({
      ...prev,
      status: BOOKING_STATES.SELECTING_LOCATION,
    }));
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0">
        <MapView
          pickup={bookingState.pickup}
          dropoff={bookingState.dropoff}
          driverLocation={driverLocation}
          onRouteCalculated={handleRouteCalculated}
          selectionMode={bookingState.status === BOOKING_STATES.SELECTING_LOCATION}
          onLocationSelect={handleLocationSelect}
        />
      </div>

      {/* Overlay Components */}
      <AnimatePresence mode="wait">
        {bookingState.status === BOOKING_STATES.INITIAL && (
          <LocationSelector
            key="location-selector"
            pickup={bookingState.pickup}
            dropoff={bookingState.dropoff}
            onLocationClick={(type) => {
              setActiveInput(type);
              setBookingState(prev => ({
                ...prev,
                status: BOOKING_STATES.SELECTING_LOCATION,
              }));
            }}
            onEditLocation={handleEditLocation}
            onConfirmLocations={() => setBookingState(prev => ({
              ...prev,
              status: BOOKING_STATES.CONFIRMING_LOCATIONS,
            }))}
          />
        )}

        {bookingState.status === BOOKING_STATES.SELECTING_LOCATION && (
          <LocationSelector
            key="location-search"
            pickup={bookingState.pickup}
            dropoff={bookingState.dropoff}
            activeInput={activeInput}
            onLocationSelect={handleLocationSelect}
            onBack={() => {
              setActiveInput(null);
              setBookingState(prev => ({
                ...prev,
                status: BOOKING_STATES.INITIAL,
              }));
            }}
            onLocationClick={() => {}}
            onEditLocation={handleEditLocation}
            onConfirmLocations={() => {}}
          />
        )}

        {bookingState.status === BOOKING_STATES.CONFIRMING_LOCATIONS && (
          <RideConfirmation
            key="ride-confirmation"
            pickup={bookingState.pickup!}
            dropoff={bookingState.dropoff!}
            routeDetails={bookingState.routeDetails}
            onRequestRide={handleRequestRide}
            onEditLocation={handleEditLocation}
          />
        )}

        {bookingState.status === BOOKING_STATES.FINDING_DRIVERS && (
          <DriverSearch key="driver-search" />
        )}

        {(bookingState.status === BOOKING_STATES.DRIVER_FOUND ||
          bookingState.status === BOOKING_STATES.DRIVER_ACCEPTED ||
          bookingState.status === BOOKING_STATES.DRIVER_ARRIVING) && (
          <DriverTracking
            key="driver-tracking"
            driver={bookingState.selectedDriver!}
            routeDetails={bookingState.routeDetails}
            status={bookingState.status}
            onCancelRide={handleCancelRide}
          />
        )}
      </AnimatePresence>
    </div>
  );
}