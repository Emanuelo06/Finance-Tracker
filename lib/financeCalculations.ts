import { Budget, Transaction } from "@/lib/firestore";
import { db } from "./firebase";
import { getDoc, doc, updateDoc, collection, where, query, getDocs } from "firebase/firestore";

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