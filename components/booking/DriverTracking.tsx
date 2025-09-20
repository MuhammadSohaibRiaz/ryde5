'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Phone, MessageSquare, Star } from 'lucide-react';
import type { Driver, RouteDetails } from '@/types';
import { Button } from '@/components/ui/Button';
import { BOOKING_STATES } from '@/config/constants';

interface DriverTrackingProps {
  driver: Driver;
  routeDetails: RouteDetails | null;
  status: string;
  onCancelRide: () => void;
}

export default function DriverTracking({
  driver,
  routeDetails,
  status,
  onCancelRide,
}: DriverTrackingProps) {
  const getStatusMessage = () => {
    switch (status) {
      case BOOKING_STATES.DRIVER_FOUND:
        return 'Driver Found!';
      case BOOKING_STATES.DRIVER_ACCEPTED:
        return 'Driver Accepted';
      case BOOKING_STATES.DRIVER_ARRIVING:
        return 'Driver is on the way';
      default:
        return 'Connecting...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case BOOKING_STATES.DRIVER_FOUND:
        return 'text-green-600';
      case BOOKING_STATES.DRIVER_ACCEPTED:
        return 'text-blue-600';
      case BOOKING_STATES.DRIVER_ARRIVING:
        return 'text-primary-600';
      default:
        return 'text-gray-600';
    }
  };

  // Show success popup for driver found
  if (status === BOOKING_STATES.DRIVER_FOUND) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute inset-0 flex items-center justify-center px-4 bg-black/20"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-gray-800">Driver Found!</h3>
              <p className="text-gray-500">Your ride is confirmed</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Main driver tracking interface
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
        {/* Driver Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <img
              src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop`}
              alt={driver.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{driver.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{driver.rating}</span>
              <span>•</span>
              <span>{driver.vehicle.make} {driver.vehicle.model}</span>
              <span>•</span>
              <span>{driver.vehicle.licensePlate}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Status</span>
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusMessage()}
            </span>
          </div>
          {routeDetails?.pickupEta && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Estimated arrival</span>
              <span className="font-medium">{routeDetails.pickupEta} mins</span>
            </div>
          )}
        </div>

        {/* Trip Details */}
        {routeDetails && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Trip Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Distance</span>
                <p className="font-medium">{routeDetails.distance}</p>
              </div>
              <div>
                <span className="text-gray-600">Duration</span>
                <p className="font-medium">{routeDetails.duration}</p>
              </div>
              <div>
                <span className="text-gray-600">Fare</span>
                <p className="font-medium text-primary-600">{routeDetails.fare}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancelRide}
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
          >
            Cancel Ride
          </Button>
          <Button className="flex-1">
            Share Trip
          </Button>
        </div>
      </div>
    </motion.div>
  );
}