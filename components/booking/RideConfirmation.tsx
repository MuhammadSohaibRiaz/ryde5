'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Edit2 } from 'lucide-react';
import type { Location, RouteDetails } from '@/types';
import { Button } from '@/components/ui/Button';

interface RideConfirmationProps {
  pickup: Location;
  dropoff: Location;
  routeDetails: RouteDetails | null;
  onRequestRide: () => void;
  onEditLocation: (type: 'pickup' | 'dropoff') => void;
}

export default function RideConfirmation({
  pickup,
  dropoff,
  routeDetails,
  onRequestRide,
  onEditLocation,
}: RideConfirmationProps) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
    >
      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Confirm your ride</h2>
        
        <div className="space-y-4">
          {/* Pickup Location */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Pickup</p>
              <p className="font-medium">{pickup.address}</p>
            </div>
            <button
              onClick={() => onEditLocation('pickup')}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <Edit2 className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Dropoff Location */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Dropoff</p>
              <p className="font-medium">{dropoff.address}</p>
            </div>
            <button
              onClick={() => onEditLocation('dropoff')}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <Edit2 className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Route Details */}
        {routeDetails && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-medium text-gray-800">Trip Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-4 h-4 text-gray-500 mr-1" />
                </div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{routeDetails.duration}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                </div>
                <p className="text-sm text-gray-500">Distance</p>
                <p className="font-medium">{routeDetails.distance}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                </div>
                <p className="text-sm text-gray-500">Estimated fare</p>
                <p className="font-medium text-primary-600">{routeDetails.fare}</p>
              </div>
            </div>
          </div>
        )}

        <Button onClick={onRequestRide} className="w-full" size="lg">
          Request Ride
        </Button>
      </div>
    </motion.div>
  );
}