"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#1A1040] border-b border-[#FF2A6D]/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-[#FF2A6D] font-bold text-2xl">Interview</span>
              <span className="text-[#9D4EDD] font-bold text-2xl">Buddy</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/about" className="text-[#D1D7E0] hover:text-[#05FFF8] px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link href="/features" className="text-[#D1D7E0] hover:text-[#05FFF8] px-3 py-2 rounded-md text-sm font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-[#D1D7E0] hover:text-[#05FFF8] px-3 py-2 rounded-md text-sm font-medium">
              Pricing
            </Link>
            <Link href="/generate" className="bg-[#FF2A6D] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#FF2A6D]/80 transition duration-300 ease-in-out">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#D1D7E0] hover:text-[#05FFF8] focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#231651] border-b border-[#FF2A6D]/30">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-[#D1D7E0] hover:bg-[#FF2A6D]/10 hover:text-[#05FFF8]">
              About
            </Link>
            <Link href="/features" className="block px-3 py-2 rounded-md text-base font-medium text-[#D1D7E0] hover:bg-[#FF2A6D]/10 hover:text-[#05FFF8]">
              Features
            </Link>
            <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-[#D1D7E0] hover:bg-[#FF2A6D]/10 hover:text-[#05FFF8]">
              Pricing
            </Link>
            <div className="pt-2 mt-2">
              <Link href="/generate" className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-[#FF2A6D] hover:bg-[#FF2A6D]/80 transition duration-300 ease-in-out">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;