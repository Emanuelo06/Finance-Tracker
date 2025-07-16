"use client"

import { useState } from 'react';
import React from 'react'
import { IoMdMenu } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { PiCurrencyDollarSimpleFill } from "react-icons/pi";
import { IoLogOut } from "react-icons/io5";
import Link from 'next/link';
import { MdAnalytics } from "react-icons/md";
const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav
      className={`h-screen bg-[#2E296B] transition-all duration-300 flex flex-col justify-between
        ${isOpen ? 'fixed top-0 left-0 z-40' : 'relative z-10'}
        ${isOpen ? 'w-[35vw] sm:w-[16vw] md:w-[10%]' : 'w-[12vw] sm:w-[7vw] md:w-[5%]'}
        min-w-[44px] max-w-[180px]`
      }
    >
      <ul
        className={`flex text-base sm:text-lg md:text-2xl lg:text-3xl flex-col gap-4 sm:gap-5 transition-all duration-300 text-white
          ${isOpen ? 'items-start pl-2' : 'items-center pl-0'}
        `}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='mt-4 sm:mt-5 cursor-pointer flex items-center gap-1 sm:gap-2'
        >
          <IoMdMenu />
          <span className={`text-xs sm:text-sm md:text-base lg:text-lg ${isOpen ? 'block' : 'hidden'}`}>Menu</span>
        </button>
        <Link href="/dashboard" className='mt-2 sm:mt-3 cursor-pointer flex items-center gap-1 sm:gap-2'>
          <FaHome />
          <span className={`text-xs sm:text-sm md:text-base lg:text-lg ${isOpen ? 'block' : 'hidden'}`}>Home</span>
        </Link>
        <Link href="/transactions" className='mt-2 sm:mt-3 cursor-pointer flex items-center gap-1 sm:gap-2'>
          <PiCurrencyDollarSimpleFill />
          <span className={`text-xs sm:text-sm md:text-base lg:text-lg ${isOpen ? 'block' : 'hidden'}`}>Transactions</span>
        </Link>
        <Link href="/budgets" className='mt-2 sm:mt-3 cursor-pointer flex items-center gap-1 sm:gap-2'>
          <MdAnalytics />
          <span className={`text-xs sm:text-sm md:text-base lg:text-lg ${isOpen ? 'block' : 'hidden'}`}>Budgets</span>
        </Link>
      </ul>
      <div
        className={`mb-4 sm:mb-5 flex w-full transition-all duration-300`}
      >
        <button
          className={`cursor-pointer flex items-center gap-1 sm:gap-2 text-base sm:text-lg md:text-2xl lg:text-3xl text-white mt-0 w-full
            ${isOpen ? 'justify-start pl-2' : 'justify-center'}
          `}
        >
          <IoLogOut />
          <span className={`text-xs sm:text-sm md:text-base lg:text-lg ${isOpen ? 'block' : 'hidden'}`}>Logout</span>
        </button>
      </div>
    </nav>
  )
}

export default MobileNavbar