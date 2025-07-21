"use client"

import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/hooks'

const Page = () => {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const router = useRouter();
  const transactions = useAppSelector((state) => state.transactions.data);

  // Get unique categories for the category filter
  const categories = useMemo(() => Array.from(new Set(transactions.map(tx => tx.category).filter(Boolean))), [transactions]);

  // Filter transactions by search, date, type, and category
  const filtered = useMemo(() => transactions.filter(tx => {
    const matchesSearch =
      tx.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase()) ||
      tx.type.toLowerCase().includes(search.toLowerCase());
    const dateStr = tx.date ? (typeof tx.date === 'string' ? tx.date : tx.date.toISOString()) : '';
    const matchesDate = date ? dateStr.startsWith(date) : true;
    const matchesType = type ? tx.type === type : true;
    const matchesCategory = category ? tx.category === category : true;
    return matchesSearch && matchesDate && matchesType && matchesCategory;
  }), [transactions, search, date, type, category]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <Navbar />
        <div className="max-w-screen-lg mx-auto w-full p-2 sm:p-4">
          <h1 className="text-3xl self-start font-bold text-[#0038A9] ml-4 mb-4 mt-8 ">Transactions</h1>
          <div className="flex justify-end mb-2"></div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-1/4 p-2 rounded-lg border border-gray-300"
            />
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full md:w-1/4 p-2 rounded-lg border border-gray-300"
            />
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full md:w-1/4 p-2 rounded-lg border border-gray-300"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full md:w-1/4 p-2 rounded-lg border border-gray-300"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <div className="w-full flex justify-end">
              <button
                onClick={() => router.push('/addTransaction')}
                className="bg-[#0038A9] hover:bg-[#225B97] text-white font-semibold py-2 px-4 rounded-xl shadow transition-colors"
              >
                + Add Transaction
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <ul className="space-y-2 w-full min-w-[600px]">
              {/* Header Row for alignment on desktop */}
              <li className="hidden sm:grid grid-cols-5 gap-2 md:gap-4 px-2 md:px-4 py-2 font-semibold text-[#0038A9] text-xs md:text-base">
                <span>Name</span>
                <span>Category</span>
                <span>Type</span>
                <span>Amount</span>
                <span>Date</span>
              </li>
              {filtered.map(tx => (
                <li
                  key={tx.id}
                  className="bg-[#EDF1FF] rounded-xl shadow-md flex flex-col sm:grid sm:grid-cols-5 gap-1 sm:gap-4 p-2 md:p-4 items-start sm:items-center text-xs md:text-base"
                >
                  {/* Mobile layout: label + value, Desktop: just value */}
                  <div className="flex flex-row sm:block w-full bg-[#EDF1FF]">
                    <span className="font-semibold text-[10px] text-gray-400 block sm:hidden w-20">Name:</span>
                    <span className="truncate text-xs md:text-base lg:text-lg font-semibold">{tx.name}</span>
                  </div>
                  <div className="flex flex-row sm:block w-full bg-[#EDF1FF]">
                    <span className="font-semibold text-[10px] text-gray-400 block sm:hidden w-20">Category:</span>
                    <span className="truncate text-xs md:text-base lg:text-lg text-gray-500 font-semibold">{tx.category}</span>
                  </div>
                  <div className="flex flex-row sm:block w-full bg-[#EDF1FF]">
                    <span className="font-semibold text-[10px] text-gray-400 block sm:hidden w-20">Type:</span>
                    <span className={`text-xs md:text-base lg:text-lg font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</span>
                  </div>
                  <div className="flex flex-row sm:block w-full bg-[#EDF1FF]">
                    <span className="font-semibold text-[10px] text-gray-400 block sm:hidden w-20">Amount:</span>
                    <span className="text-xs md:text-base lg:text-lg font-semibold">${tx.amount}</span>
                  </div>
                  <div className="flex flex-row sm:block w-full bg-[#EDF1FF]">
                    <span className="font-semibold text-[10px] text-gray-400 block sm:hidden w-20">Date:</span>
                    <span className="text-xs md:text-base lg:text-lg font-semibold">
                      {typeof tx.date === "string" ? tx.date : tx.date.toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Page