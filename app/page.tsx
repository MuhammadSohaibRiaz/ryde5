import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, Car } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Choose Your Ryde5 Experience',
  description: 'Whether you\'re looking to ride or drive, Ryde5 has got you covered. Join thousands of satisfied customers.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <Image 
          src="/logo.png" 
          alt="Ryde5 Logo" 
          width={180} 
          height={35} 
          priority 
          className="object-contain"
        />
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Choose Your Ryde5 Experience
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Whether you&apos;re looking to ride or drive, we&apos;ve got you covered with premium transportation solutions
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 border-0 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 h-full">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="mb-6">
                  <Users className="w-16 h-16 text-primary-500 mx-auto" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-4">Ride with Us</h2>
                <p className="text-gray-300 mb-8 leading-relaxed flex-grow">
                  Get to your destination safely and comfortably with our trusted drivers. 
                  Premium service at competitive prices.
                </p>
                <Link href="/auth/passenger/login">
                  <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center">
                    Continue as Passenger
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-0 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 h-full">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="mb-6">
                  <Car className="w-16 h-16 text-primary-500 mx-auto" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-4">Drive with Us</h2>
                <p className="text-gray-300 mb-8 leading-relaxed flex-grow">
                  Turn your car into an income source and be your own boss. 
                  Flexible hours, competitive earnings.
                </p>
                <Link href="/auth/driver/login">
                  <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center">
                    Continue as Driver
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-3xl font-bold text-primary-500 mb-2">10K+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold text-primary-500 mb-2">5K+</div>
              <div className="text-gray-300">Trusted Drivers</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold text-primary-500 mb-2">4.9★</div>
              <div className="text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-400 border-t border-gray-700">
        <p>&copy; 2025 Ryde5 | All Rights Reserved</p>
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <Link href="/privacy" className="hover:text-primary-500 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary-500 transition-colors">
            Terms of Service
          </Link>
          <Link href="/support" className="hover:text-primary-500 transition-colors">
            Support
          </Link>
        </div>
      </footer>
    </div>
  );
}