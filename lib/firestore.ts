import {collection} from "firebase/firestore";
import { db } from "./firebase";
export type TransactionType = "income" | "expense";
export interface Transaction {
   id: string;
   name: string
   amount: number;
   date: Date;
   type: TransactionType;
   category: string;
   description: string;
   userId: string;
   budgetId?: string;
}

export interface Budget{
   id:string;
   name: string;
   icon: string;
   limit: number;
   currentSpent: number;
   userId: string;
}
export const getTransactionsRef = (userId: string) =>
   collection(db, "users", userId, "transactions")
export const getBudgetsRef = (userId: string) =>
   collection(db, "users", userId, "budgets");