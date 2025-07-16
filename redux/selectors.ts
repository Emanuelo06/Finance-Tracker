import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';

export const selectTotals = createSelector(
  (state: RootState) => state.transactions.list,
  (transactions) => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'income') income += tx.amount;
      else expenses += tx.amount;
    });

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }
);
