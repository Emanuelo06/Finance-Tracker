"use client";

import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAppSelector } from '@/hooks/hooks';

const AddTransactionModal = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
    date: "",
    type: "expense",
    description: "",
    budgetId: "",
  });

  // 🟡 If user is not ready, don’t show the form yet
  if (!user) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading user...
      </div>
    );
  }

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      <h2 className="text-xl font-bold text-gray-800">Add Transaction</h2>

      <div>
        <label className="block font-medium text-sm">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded-md bg-white"
        />
      </div>

      <div>
        <label className="block font-medium text-sm">Amount</label>
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded-md bg-white"
        />
      </div>

      <div>
        <label className="block font-medium text-sm">Category</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded-md bg-white"
        />
      </div>

      <div>
        <label className="block font-medium text-sm">Date</label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md bg-white"
        />
      </div>

      <div>
        <label className="block font-medium text-sm">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md bg-white"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div>
        <label className="block font-medium text-sm">Description</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md bg-white"
        />
      </div>

      <div>
        <label className="block font-medium text-sm">Budget ID (optional)</label>
        <input
          name="budgetId"
          value={form.budgetId}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md bg-white"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Add Transaction
      </button>
    </form>
  );
};

export default AddTransactionModal;
