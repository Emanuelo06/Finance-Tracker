// components/GraphCard.tsx
"use client"

import React from 'react'
import Image from 'next/image'

const GraphCard = () => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md mt-6 p-4">
      <div className="flex justify-end mb-2">
        <select
          className="text-sm rounded-full px-4 py-1 bg-blue-600 text-white outline-none"
        >
          <option value="30">Last 30 days</option>
          <option value="7">Last 7 days</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <div className="rounded-xl overflow-hidden">
        <Image
          src="/graph.png" // 👈 replace with your actual image path
          alt="Graph"
          width={800}
          height={400}
          className="w-full object-cover"
        />
      </div>
    </div>
  )
}

export default GraphCard
