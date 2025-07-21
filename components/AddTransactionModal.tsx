"use client";

import React, { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAppSelector } from '@/hooks/hooks';


const AddTransactionModal = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [budgets, setBudgets] = useState<{ id: string; title: string; category: string; }[]>([]);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
    date: "",
    type: "expense",
    description: "",
    budgetId: "",
  });

  useEffect(() => {
    const fetchBudgets = async () => {
      if (!user) return;
      const { getFirestore, collection, getDocs } = await import('firebase/firestore');
      const db = getFirestore();
      const budgetsRef = collection(db, "users", user.uid, "budgets");
      const snapshot = await getDocs(budgetsRef);
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return { id: doc.id, title: d.title, category: d.category };
      });
      setBudgets(data);
    };
    fetchBudgets();
  }, [user]);

  // 🟡 If user is not ready, don’t show the form yet
  if (!user) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading user...
      </div>
    );
  }


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // If budgetId is changed, set category automatically
    if (name === "budgetId") {
      const selected = budgets.find(b => b.id === value);
      setForm((prev) => ({
        ...prev,
        budgetId: value,
        category: selected ? selected.category : prev.category,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const transaction = {
        name: form.name,
        amount: parseFloat(form.amount),
        category: form.category,
        type: form.type,
        date: form.date || new Date().toISOString(),
        userId: user.uid,
        createdAt: serverTimestamp(),
        description: form.description,
        budgetId: form.budgetId || null,
      };

      await addDoc(collection(db, 'users', user.uid, 'transactions'), transaction);

      setForm({
        name: "",
        amount: "",
        category: "",
        date: "",
        type: "expense",
        description: "",
        budgetId: "",
      });

      alert("Transaction added!");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-10 p-6 bg-[#EDF1FF] rounded-xl shadow space-y-4"
    >
      <h1 className="text-xl md:text-2xl font-bold text-[#0038A9]">Add Transaction</h1>

      <div>
        <label className="block text-[#0038A9] font-medium text-sm md:text-base">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded-3xl bg-white"
        />
      </div>

      <div>
        <label className="block font-medium text-[#0038A9] text-sm md:text-base">Amount</label>
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded-3xl bg-white"
        />
      </div>

      <div>
        <label className="block font-medium text-[#0038A9] text-sm md:text-base">Category</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded-3xl bg-white"
        />
      </div>

      <div>
        <label className="block font-medium text-[#0038A9] text-sm md:text-base">Date</label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-3xl bg-white"
        />
      </div>

      <div>
        <label className="block font-medium text-[#0038A9] text-sm md:text-base">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-3xl bg-white"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div>
        <label className="block font-medium text-[#0038A9] text-sm md:text-base">Description</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-3xl bg-white"
        />
      </div>


      <div>
        <label className="block font-medium text-[#0038A9] text-sm md:text-base">Link to Budget (optional)</label>
        <select
          name="budgetId"
          value={form.budgetId}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-3xl bg-white"
        >
          <option value="">-- No Budget --</option>
          {budgets.map(b => (
            <option key={b.id} value={b.id}>{b.title}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-[#0038A9] text-white p-2 rounded-3xl hover:bg-blue-700"
      >
        Add Transaction
      </button>
    </form>
  );
};

export default AddTransactionModal;
