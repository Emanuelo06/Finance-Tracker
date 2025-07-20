import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

interface Transaction {
   id: string,
   amount: number,
   date: Timestamp | string,
   type: "income" | "expense"
   category: string
   description: string,
   budgetId?: string
}

export type { Transaction}