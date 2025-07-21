import { Transaction } from "@/lib/firestore";
import { db } from "./firebase";
import { collection, where, query, getDocs, updateDoc } from "firebase/firestore";

// 1. Total Balance: Income - Expenses (net balance)
export const calculateBalance = (transactions: Transaction[]) => {
  return transactions.reduce((total, t) => 
    t.type === "income" ? total + t.amount : total - t.amount, 
  0);
};

// 2. Daily Change: Net change (Income - Expenses) in the last 24H
export const getDailyChange = (transactions: Transaction[]) => {
  const now = new Date();
  const last24H = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

  return transactions
    .filter(t => new Date(t.date) >= last24H)
    .reduce((sum, t) => 
      t.type === "income" ? sum + t.amount : sum - t.amount, 
    0);
};

// 3. 30-Day Change: Net change (Income - Expenses) in the last 30 days
export const get30DayChange = (transactions: Transaction[]) => {
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  return transactions
    .filter(t => new Date(t.date) >= last30Days)
    .reduce((sum, t) => 
      t.type === "income" ? sum + t.amount : sum - t.amount, 
    0);
};


export const updateBudgetOnTransaction = async (
   transaction: Transaction,
   userId: string
) => {
   const budgetsRef = collection(db, "users", userId,  "budgets");
   const q = query(budgetsRef, where("category", "==", transaction.category))
   const querySnapshot = await getDocs(q);
   
   if (querySnapshot.empty) return;

   const budgetDoc = querySnapshot.docs[0];
   const data = budgetDoc.data();
   const currentAmount = data.currentAmount || 0;

   await updateDoc(budgetDoc.ref, {
      currentAmount: currentAmount + transaction.amount,
   });
}

export const  revertBudgetOnTransaction = async (transaction: Transaction, userId: string) => {
   const budgetsRef = collection(db, "users", userId, "budgets");
   const q = query(budgetsRef, where("category", "==", transaction.category));
   const querySnapshot = await getDocs(q);

   if(querySnapshot.empty) return;

   const budgetDoc = querySnapshot.docs[0];
   const data = budgetDoc.data();
   const currentAmount = data.currentAmount || 0;

   await updateDoc(budgetDoc.ref, {
      currentAmount: Math.max(0, currentAmount - transaction.amount)
   });
};