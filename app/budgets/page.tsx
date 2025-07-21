"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Budget } from "@/types/budget";
import { Transaction } from "@/lib/firestore";
import { setTransactions } from "@/redux/slices/transactionsSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import BudgetCard from "@/components/BudgetCard";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

const BudgetsPage = () => {
  const dispatch = useAppDispatch();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");

  const transactions = useAppSelector((state) => state.transactions.data);

  // Fetch budgets from Firestore
  const fetchBudgets = async (uid: string) => {
    const db = getFirestore();
    const budgetsRef = collection(db, "users", uid, "budgets");
    const snapshot = await getDocs(budgetsRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Budget[];
    setBudgets(data);
  };

  // Fetch transactions from Firestore and dispatch to Redux
  const fetchTransactions = async (uid: string) => {
    const db = getFirestore();
    const transactionsRef = collection(db, "users", uid, "transactions");
    const snapshot = await getDocs(transactionsRef);
    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name ?? "",
        amount: d.amount ?? 0,
        date: d.date && typeof d.date.toDate === "function" ? d.date.toDate().toISOString() : d.date,
        type: d.type ?? "expense",
        category: d.category ?? "",
        description: d.description ?? "",
        userId: d.userId ?? userId,
        budgetId: d.budgetId,
        createdAt: d.createdAt && typeof d.createdAt.toDate === "function" ? d.createdAt.toDate().toISOString() : d.createdAt,
      };
    }) as Transaction[];
    dispatch(setTransactions(data));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchBudgets(user.uid);
        fetchTransactions(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);



  // Calculate spent for each budget
  const getSpent = (budget: Budget) => {
    return transactions
      .filter((tx) => tx.category === budget.category)
      .reduce((sum, tx) => sum + (tx.type === "expense" ? tx.amount : 0), 0);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <Navbar/>
        <main className="w-full max-w-screen-lg mx-auto p-4 sm:p-8">
          <h1 className="text-3xl font-bold text-[#0038A9] mb-4">Budgets</h1>
          <button
            className="bg-[#0038A9] text-white px-6 py-2 rounded-xl shadow font-semibold mb-6 hover:bg-[#225B97]"
            onClick={() => router.push("/addBudget")}
          >
            + Add budget
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                emoji={budget.emoji}
                title={budget.title}
                category={budget.category}
                limit={budget.limit}
                spent={getSpent(budget)}
                onEdit={() => router.push(`/addBudget?id=${budget.id}`)}
                onDelete={async () => {
                  if (confirm('Are you sure you want to delete this budget?')) {
                    const db = getFirestore();
                    const budgetRef = collection(db, "users", userId, "budgets");
                    // Remove from Firestore
                    await (await import("firebase/firestore")).deleteDoc(
                      (await import("firebase/firestore")).doc(budgetRef, budget.id)
                    );
                    // Remove from local state
                    setBudgets((prev) => prev.filter((b) => b.id !== budget.id));
                  }
                }}
              />
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default BudgetsPage;