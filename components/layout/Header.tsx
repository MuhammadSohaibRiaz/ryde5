'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserCircle, Car } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <Link href="/" className="flex items-center">
        <Image 
          src="/logo.png" 
          alt="Ryde5 Logo" 
          width={180} 
          height={35} 
          priority 
          className="object-contain"
        />
      </Link>
      
      <nav className="hidden md:flex items-center space-x-6">
        <Link
          href="/profile"
          className="flex items-center px-4 py-2 text-gray-700 hover:text-primary-500 transition-colors"
        >
          <UserCircle className="w-5 h-5 mr-2" />
          User Profile
        </Link>
        
        <Link
          href="/driver-profile"
          className="flex items-center px-4 py-2 text-gray-700 hover:text-primary-500 transition-colors"
        >
          <Car className="w-5 h-5 mr-2" />
          Driver Profile
        </Link>
        
        <Link href="/register-driver">
          <Button variant="outline" className="mr-2">
            Register as Driver
          </Button>
        </Link>
        
        <Link href="/admin">
          <Button>
            Admin Dashboard
          </Button>
        </Link>
      </nav>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button variant="ghost" size="sm">
          Menu
        </Button>
      </div>
    </header>
  );
}