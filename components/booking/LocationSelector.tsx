'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, ArrowLeft, X, Edit2, Navigation } from 'lucide-react';
import type { Location } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { debounce } from '@/lib/utils';

interface LocationSelectorProps {
  pickup: Location | null;
  dropoff: Location | null;
  activeInput?: 'pickup' | 'dropoff' | null;
  onLocationClick: (type: 'pickup' | 'dropoff') => void;
  onLocationSelect?: (location: Location) => void;
  onEditLocation: (type: 'pickup' | 'dropoff') => void;
  onConfirmLocations: () => void;
  onBack?: () => void;
}

export default function LocationSelector({
  pickup,
  dropoff,
  activeInput,
  onLocationClick,
  onLocationSelect,
  onEditLocation,
  onConfirmLocations,
  onBack,
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim() || !window.google) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const autocomplete = new window.google.maps.places.AutocompleteService();
        const predictions = await new Promise<any[]>((resolve, reject) => {
          autocomplete.getPlacePredictions(
            {
              input: query,
              componentRestrictions: { country: 'us' },
            },
            (results, status) => {
              if (status === 'OK' && results) {
                resolve(results);
              } else {
                resolve([]);
              }
            }
          );
        });
        setSearchResults(predictions);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const handlePlaceSelect = useCallback(
    (placeId: string, description: string) => {
      if (!window.google || !onLocationSelect) return;

      const placesService = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      placesService.getDetails(
        {
          placeId,
          fields: ['formatted_address', 'geometry'],
        },
        (place, status) => {
          if (status === 'OK' && place?.geometry?.location) {
            onLocationSelect({
              address: place.formatted_address || description,
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
            });
          }
        }
      );
    },
    [onLocationSelect]
  );

  // Search interface
  if (activeInput) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white z-10"
      >
        <div className="p-4 border-b flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder={`Search for ${activeInput === 'pickup' ? 'pickup location' : 'destination'}...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-10 pr-10"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-auto h-[calc(100vh-80px)]">
          <button
            onClick={() => {
              // Handle map selection
              console.log('Choose on map clicked');
            }}
            className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b"
          >
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-primary-500" />
            </div>
            <span className="font-medium">Choose on map</span>
          </button>

          {isSearching && (
            <div className="p-4 text-center text-gray-500">
              Searching...
            </div>
          )}

          {searchResults.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handlePlaceSelect(result.place_id, result.description)}
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b text-left"
            >
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="font-medium">{result.structured_formatting.main_text}</p>
                <p className="text-sm text-gray-500">
                  {result.structured_formatting.secondary_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  // Main location selector interface
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
    >
      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Where to?</h2>
        
        {/* Pickup Location */}
        <div className="relative">
          <button
            onClick={() => onLocationClick('pickup')}
            className="w-full p-4 pl-12 pr-12 border border-gray-300 rounded-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-colors"
          >
            <span className={pickup ? 'text-gray-900' : 'text-gray-500'}>
              {pickup?.address || 'Where are you?'}
            </span>
          </button>
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 w-5 h-5" />
          {pickup && (
            <button
              onClick={() => onEditLocation('pickup')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <Edit2 className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Dropoff Location */}
        <div className="relative">
          <button
            onClick={() => onLocationClick('dropoff')}
            className="w-full p-4 pl-12 pr-12 border border-gray-300 rounded-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-primary-300 transition-colors"
          >
            <span className={dropoff ? 'text-gray-900' : 'text-gray-500'}>
              {dropoff?.address || 'Where to?'}
            </span>
          </button>
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 w-5 h-5" />
          {dropoff && (
            <button
              onClick={() => onEditLocation('dropoff')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <Edit2 className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {pickup && dropoff && (
          <Button onClick={onConfirmLocations} className="w-full mt-6">
            Confirm Locations
          </Button>
        )}
      </div>
    </motion.div>
  );
}