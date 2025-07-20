"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import { calculateStats } from "@/lib/transactionsStats";
import { useAppSelector } from "@/lib/hooks";
import BalanceGraph from "@/components/BalanceGraph";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Dashboard() {
  async function fetchData(uid: string) {
    const { getFirestore, collection, getDocs } = await import("firebase/firestore");
    const db = getFirestore();
    const transactionsRef = collection(db, "users", uid, "transactions");
    const snapshot = await getDocs(transactionsRef);

    console.log("Fetched transactions for user:", uid, snapshot.docs.map(doc => doc.data()));
  }

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const transactions = useAppSelector((state) => state.transactions);
  const convertedTransactions = transactions.data.map(t => ({
    ...t,
    date: typeof t.date === "string" || typeof t.date === "number" ? t.date : t.date.getTime(),
  }));
  const { totalBalance, daily, monthly } = calculateStats(convertedTransactions);
  const sortedTransactions = [...transactions.data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastFiveTransactions = sortedTransactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full px-4 sm:px-6">
        {/* CONTAINER LIMIT */}
        <div className="max-w-screen-lg mx-auto py-6 flex flex-col">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#EDF1FF] shadow-lg rounded-2xl p-4 flex flex-col justify-between w-full min-h-[110px]">
              <h1 className="text-[#0048D9] font-semibold text-sm md:text-base">Total Balance</h1>
              <h1 className="text-[#0048D9] font-bold text-lg md:text-2xl">${totalBalance}</h1>
            </div>
            <div className="bg-[#EDF1FF] shadow-lg rounded-2xl p-4 flex flex-col justify-between w-full min-h-[110px]">
              <h1 className="text-[#E03A3A] font-semibold text-sm md:text-base">Today’s Change</h1>
              <h1 className="text-[#E03A3A] font-bold text-lg md:text-2xl">${daily}</h1>
            </div>
            <div className="bg-[#EDF1FF] shadow-lg rounded-2xl p-4 flex flex-col justify-between w-full min-h-[110px]">
              <h1 className="text-[#1CB351] font-semibold text-sm md:text-base">Monthly</h1>
              <h1 className="text-[#1CB351] font-bold text-lg md:text-2xl">${monthly}</h1>
            </div>
          </div>

          {/* Graph */}
          <div className="w-full mb-6 outline-0">
            <BalanceGraph />
          </div>

          {/* Last Transactions */}
          <h1 className="text-[#0038A9] text-lg font-bold mb-2">Last Transactions:</h1>
          {!lastFiveTransactions.length ? (
            <p className="text-gray-500">No transactions found</p>
          ) : (
            <ul className="space-y-2">
              {lastFiveTransactions.map((tx) => (
                <li
                  key={tx.id}
                  className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center"
                >
                  <span className="text-sm sm:text-base">{tx.name}</span>
                  <span className="font-semibold text-sm sm:text-base">${tx.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
