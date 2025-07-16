// components/TransactionList.tsx
"use client"

import React from "react"

const TransactionList = () => {
  const transactions = [
    {
      id: 1,
      date: "07/09/25",
      name: "James Narte",
      type: "Entry",
      price: 3000,
    },
    {
      id: 2,
      date: "07/09/25",
      name: "James Narte",
      type: "Exit",
      price: -3000,
    },
    {
      id: 3,
      date: "07/09/25",
      name: "James Narte",
      type: "Exit",
      price: -3000,
    },
  ]

  return (
    <div className="w-full bg-white mt-6 rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 items-center text-sm font-semibold text-[#0338A9]">
          Transactions in:
          <select className="text-sm rounded-full px-3 py-1 border border-blue-500 bg-white text-blue-600 outline-none">
            <option value="30">Last 30 days</option>
            <option value="7">Last 7 days</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <button className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-700">
          Add
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-[#0338A9]">
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <td className="py-2 px-4">{tx.date}</td>
                <td className="py-2 px-4">{tx.name}</td>
                <td className="py-2 px-4">{tx.type}</td>
                <td className={`py-2 px-4 font-semibold ${tx.price > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.price > 0 ? `$${tx.price.toFixed(2)}` : `- $${Math.abs(tx.price).toFixed(2)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-700">
          See More
        </button>
      </div>
    </div>
  )
}

export default TransactionList
