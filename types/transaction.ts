import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

interface transaction {
   id: string,
   amount: number,
   date: Timestamp | string,
   type: "income" | "expense"
   category: string
   description: string,
   budgetId?: string
}

export type { transaction}