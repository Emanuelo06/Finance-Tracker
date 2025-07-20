import { Transaction } from "@/types/transaction";

export const calculateStats = (transactions: Transaction[]) => {
  const now = new Date();

  const today = now.toISOString().split("T")[0];
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  let totalBalance = 0;
  let daily = 0;
  let monthly = 0;

  for(const tx of transactions) {
    const txDate = new Date(tx.date);
    totalBalance += tx.amount;

    const txDay = String(tx.date).split("T")[0];
    if(txDay === today) {
      daily += tx.amount;
    }

    if(txDate.getMonth() === thisMonth && txDate.getFullYear() === thisYear){
      monthly += tx.amount;
    }
  }

  return {
    totalBalance,
    daily,
    monthly,
  }
}