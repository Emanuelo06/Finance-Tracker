"use client";
import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp, getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAppSelector } from "@/lib/hooks";
import { useSearchParams, useRouter } from "next/navigation";

const AddBudgetModal = () => {
  const user = useAppSelector((state) => state.auth.user);
  const searchParams = useSearchParams();
  const router = useRouter();
  const budgetId = searchParams.get("id");
  const [loading, setLoading] = useState(!!budgetId);
  const [form, setForm] = useState({
    title: "",
    category: "",
    limit: "",
  });

  useEffect(() => {
    const fetchBudget = async () => {
      if (user && budgetId) {
        setLoading(true);
        const db = getFirestore();
        const ref = doc(db, "users", user.uid, "budgets", budgetId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data();
          setForm({
            title: d.title || "",
            category: d.category || "",
            limit: d.limit ? String(d.limit) : "",
          });
        }
        setLoading(false);
      }
    };
    fetchBudget();
  }, [user, budgetId]);

  if (!user || loading) {
    return (
      <div className="text-center py-10 text-gray-500">{loading ? "Loading budget..." : "Loading user..."}</div>
    );
  }

  const handleChange = (
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
      const budget = {
        title: form.title,
        category: form.category,
        limit: parseFloat(form.limit),
        currentSpent: 0,
        userId: user.uid,
        startDate: new Date().toISOString(),
        createdAt: serverTimestamp(),
      };
      const db = getFirestore();
      if (budgetId) {
        // Update existing budget
        const ref = doc(db, "users", user.uid, "budgets", budgetId);
        await updateDoc(ref, budget);
        alert("Budget updated!");
      } else {
        // Add new budget
        await addDoc(collection(db, "users", user.uid, "budgets"), budget);
        alert("Budget added!");
      }
      router.push("/budgets");
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Failed to save budget. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-10 p-6 bg-[#EDF1FF] rounded-xl shadow space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-[#0038A9]">{budgetId ? "Edit Budget" : "Add Budget"}</h2>

      <div>
        <label className="block font-medium text-sm md:text-base text-[#0038A9]">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded-3xl bg-white"
        />
      </div>

      <div>
        <label className="block font-medium text-sm md:text-base text-[#0038A9]">Category</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded-3xl bg-white"
        />
      </div>

      <div>
        <label className="block font-medium text-sm md:text-base text-[#0038A9]">Limit</label>
        <input
          name="limit"
          type="number"
          value={form.limit}
          onChange={handleChange}
          required
          min={1}
          className="w-full mt-1 p-2 border rounded-3xl bg-white"
        />
      </div>

      <button
        type="submit"
        className="w-full  bg-[#0038A9] text-white py-2 rounded-3xl font-semibold hover:bg-[#225B97]"
      >
        {budgetId ? "Update Budget" : "Add Budget"}
      </button>
    </form>
  );
};

export default AddBudgetModal;