import { Budget, Transaction } from "@/lib/firestore";
import { db } from "./firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";

export const calculateBalance = (transactions: Transaction[]) => {
   return transactions.reduce((total, t)=> 
   t.type === "income" ? total + t.amount : total - t.amount, 0);
};

export const getDailyChange = (transactions: Transaction[]) => {
   const today = new Date();
   today.setHours(0, 0, 0, 0);

   return transactions
   .filter(t => t.date >= today && t.type === "expense")
   .reduce((sum, t) => sum + t.amount, 0)
};

export const updateBudgetOnTransaction = async (
   transaction: Transaction,
   userId: string
) => {
   if(transaction.type !== "expense" || !transaction.budgetId) return;

   const budgetRef = doc(db, "users", userId, "budgets", transaction.budgetId);
   await updateDoc(budgetRef, {
      currentSpent: increment(transaction.amount)
   })
}