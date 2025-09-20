import type { Metadata } from 'next';
import BookingInterface from '@/components/booking/BookingInterface';
import SplashScreen from '@/components/SplashScreen';

export const metadata: Metadata = {
  title: 'Book Your Ride',
  description: 'Book your premium ride with Ryde5. Fast, safe, and reliable transportation.',
};

export default function MainPage() {
  return (
    <>
      <SplashScreen />
      <div className="min-h-screen bg-gray-50">
        <BookingInterface />
      </div>
    </>
  );
}