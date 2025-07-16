import { useAppSelector } from "@/store/hooks";
import React, { useMemo } from "react";
import { calculateBalance, getDailyChange } from "@/lib/financeCalculations";

export default function Dashboard() {
  const userId = useAppSelector(state => state.auth.user?.uid);
  const transactions = useAppSelector(state => state.transactions.items);
  
  // Memoized calculations
  const balance = useMemo(() => calculateBalance(transactions), [transactions]);
  const dailyChange = useMemo(() => getDailyChange(transactions), [transactions]);

  return (
    <div>
 
    </div>
  );
}