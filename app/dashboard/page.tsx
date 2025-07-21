"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { calculateBalance, getDailyChange, get30DayChange } from "@/lib/financeCalculations";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import BalanceGraph from "@/components/BalanceGraph";
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setTransactions } from "@/redux/slices/transactionsSlice"; // 🔁 update the path if needed
import { Transaction } from "@/lib/firestore";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const transactions = useAppSelector((state) => state.transactions);

  async function fetchData(uid: string) {
    const { getFirestore, collection, getDocs } = await import("firebase/firestore");
    const db = getFirestore();
    const transactionsRef = collection(db, "users", uid, "transactions");
    const snapshot = await getDocs(transactionsRef);

    function safeToISOString(dateValue: any): string | undefined {
      const dateObj = new Date(dateValue);
      return isNaN(dateObj.getTime()) ? undefined : dateObj.toISOString();
    }
    const transactions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name ?? "",
        amount: data.amount ?? 0,
        date: data.date ?? new Date().toISOString(),
        type: data.type ?? "",
        category: data.category ?? "",
        notes: data.notes ?? "",
        createdAt: data.createdAt ? safeToISOString(data.createdAt) : undefined,
        description: data.description ?? "", // Add missing property
        userId: data.userId ?? uid, // Add missing property, fallback to uid
      };
    }) as Transaction[];

    console.log("Fetched transactions:", transactions);

    dispatch(setTransactions(transactions));
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user.uid);
        setAuthChecked(true);
      } else {
        setAuthChecked(true);
      }
    });
    return () => unsubscribe();
  }, [router]);

  
  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-gray-500">Loading...</div>;
  }
  if (authChecked && !auth.currentUser) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  const convertedTransactions = transactions.data.map(t => ({
    ...t,
    date: t.date ? new Date(t.date) : new Date(),
  }));
  const totalBalance = calculateBalance(convertedTransactions);
  const daily = getDailyChange(convertedTransactions);
  const monthly = get30DayChange(convertedTransactions);
  // Color logic for stat cards
  const dailyColor = daily === 0 ? "text-[#0038A9]" : daily < 0 ? "text-[#E03A3A]" : "text-[#1CB351]";
  const monthlyColor = monthly === 0 ? "text-[#0038A9]" : monthly < 0 ? "text-[#E03A3A]" : "text-[#1CB351]";

  const sortedTransactions: Transaction[] = [...transactions.data].sort( 
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastFiveTransactions: Transaction[] = sortedTransactions.slice(0, 5);

  return (
    <>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Navbar />
          <main className="flex-1 w-full px-1 sm:px-4">
            <div className="max-w-screen-lg mx-auto py-3 flex flex-col w-full">
              <div className="flex justify-end mb-2"></div>
              {/* Stat Cards */}
              <div
                className="grid gap-2 md:gap-4 mb-4 md:mb-6"
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                }}
              >
                <div className="bg-[#EDF1FF] shadow-lg rounded-2xl p-4 flex flex-col justify-between w-full min-h-[110px]">
                  <h1 className="text-[#0048D9] font-semibold text-sm md:text-base">Total Balance</h1>
                  <h1 className="text-[#0048D9] font-bold text-lg md:text-2xl">${totalBalance}</h1>
                </div>
                <div className="bg-[#EDF1FF] shadow-lg rounded-2xl p-4 flex flex-col justify-between w-full min-h-[110px]">
                  <h1 className="text-[#0048D9] font-semibold text-sm md:text-base">Today’s Change</h1>
                  <h1 className={`font-bold text-lg md:text-2xl ${dailyColor}`}>${daily}</h1>
                </div>
                <div className="bg-[#EDF1FF] shadow-lg rounded-2xl p-4 flex flex-col justify-between w-full min-h-[110px]">
                  <h1 className="text-[#0048D9] font-semibold text-sm md:text-base">Monthly</h1>
                  <h1 className={`font-bold text-lg md:text-2xl ${monthlyColor}`}>${monthly}</h1>
                </div>
              </div>

              {/* Graph */}
              <div className="w-full mb-4 md:mb-6 outline-0 min-w-[260px]">
                <BalanceGraph />
              </div>

              {/* Last Transactions */}
              <div className="w-full flex flex-row justify-between px-2 sm:px-4 md:px-8">
                <h1 className="text-[#0038A9] text-lg font-bold mb-2">Last Transactions:</h1>
                <button
                  onClick={() => router.push('/addTransaction')}
                  className="bg-[#0038A9] hover:bg-[#225B97] text-white font-semibold py-2 px-4 rounded-xl shadow transition-colors"
                >
                  + Add Transaction
                </button>
              </div>
              {!lastFiveTransactions.length ? (
                <p className="text-gray-500">No transactions found</p>
              ) : (
                <ul className="space-y-2 w-full">
                  {/* Header Row for alignment on desktop */}
                  <li className="hidden sm:grid grid-cols-6 gap-2 md:gap-4 px-2 md:px-4 py-2 font-semibold text-[#0038A9] text-xs md:text-base">
                    <span>Name</span>
                    <span>Category</span>
                    <span>Type</span>
                    <span>Date</span>
                    <span>Amount</span>
                    <span></span>
                  </li>
                  {lastFiveTransactions.map((tx: Transaction) => (
                    <li
                      key={tx.id}
                      className="bg-[#EDF1FF] rounded-xl shadow-md flex flex-col sm:grid sm:grid-cols-6 gap-1 sm:gap-4 p-2 md:p-4 items-start sm:items-center text-xs md:text-base"
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
                        <span className={`text-xs md:text-base lg:text-lg font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</span>
                      </div>
                      <div className="flex flex-row sm:block w-full bg-[#EDF1FF]">
                        <span className="font-semibold text-[10px] text-gray-400 block sm:hidden w-20">Date:</span>
                        <span className="text-xs md:text-base lg:text-lg font-semibold">
                          {typeof tx.date === "string" ? tx.date : tx.date.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-row sm:block w-full bg-[#EDF1FF]">
                        <span className="font-semibold text-[10px] text-gray-400 block sm:hidden w-20">Amount:</span>
                        <span className="text-xs md:text-base lg:text-lg font-semibold">${tx.amount}</span>
                      </div>
                      <div className="flex flex-row sm:block w-full bg-[#EDF1FF]">
                        <span className="font-semibold text-[10px] text-gray-400 block sm:hidden w-20">Delete:</span>
                        <button
                          title="Delete"
                          onClick={async () => {
                            if (!confirm('Are you sure you want to delete this transaction?')) return;
                            const { getFirestore, doc, deleteDoc } = await import('firebase/firestore');
                            const db = getFirestore();
                            await deleteDoc(doc(db, 'users', tx.userId, 'transactions', tx.id));
                          }}
                          className="text-red-500 hover:text-red-700 focus:outline-none hover:cursor-pointer flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 lg:w-6 md:h-5 lg:">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  )
}
