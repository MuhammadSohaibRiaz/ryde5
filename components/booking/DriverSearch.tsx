'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DriverSearch() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 flex items-center justify-center px-4 bg-black/20"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-primary-500" />
            </div>
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full border-2 border-primary-200 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full border-2 border-primary-200 animate-pulse-ring" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-gray-800">Finding your driver</h3>
            <p className="text-gray-500">Looking for nearby drivers...</p>
          </div>
          
          <LoadingSpinner size="lg" />
        </div>
      </div>
    </motion.div>
  );
}