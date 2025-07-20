"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { PiCurrencyDollarSimpleFill } from 'react-icons/pi';
import { MdAnalytics } from 'react-icons/md';
import { IoLogOut } from 'react-icons/io5';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';


const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex w-full bg-[#2E296B] h-16 items-center px-8 justify-between shadow z-20">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-white text-lg font-semibold hover:underline">
            <FaHome /> Dashboard
          </Link>
          <Link href="/transactions" className="flex items-center gap-2 text-white text-lg font-semibold hover:underline">
            <PiCurrencyDollarSimpleFill /> Transactions
          </Link>
          <Link href="/budgets" className="flex items-center gap-2 text-white text-lg font-semibold hover:underline">
            <MdAnalytics /> Budgets
          </Link>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-white text-lg font-semibold hover:underline">
          <IoLogOut /> Logout
        </button>
      </nav>

      {/* Mobile Navbar */}
      <nav className="flex md:hidden w-full bg-[#2E296B] h-16 items-center px-4 justify-between shadow z-20 relative">
        <div className="flex items-center gap-2">
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl focus:outline-none"
          >
            {/* Hamburger icon */}
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-white text-lg font-semibold">Menu</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-white text-lg font-semibold hover:underline">
          <IoLogOut />
        </button>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-[#2E296B] flex flex-col items-start py-4 px-6 gap-4 shadow z-30 animate-fade-in">
            <Link href="/dashboard" className="flex items-center gap-2 text-white text-base font-semibold hover:underline" onClick={() => setMenuOpen(false)}>
              <FaHome /> Dashboard
            </Link>
            <Link href="/transactions" className="flex items-center gap-2 text-white text-base font-semibold hover:underline" onClick={() => setMenuOpen(false)}>
              <PiCurrencyDollarSimpleFill /> Transactions
            </Link>
            <Link href="/budgets" className="flex items-center gap-2 text-white text-base font-semibold hover:underline" onClick={() => setMenuOpen(false)}>
              <MdAnalytics /> Budgets
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;