import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc } from "firebase/firestore";
import { getTransactionsRef } from "@/lib/firestore";
import { updateBudgetOnTransaction } from "@/lib/financeCalculations";
import type { Transaction } from "@/lib/firestore";

interface TransactionsState {
  items: Transaction[];
  status: "idle" | "loading" | "failed"
}

const initialState: TransactionsState = {
  items: [],
  status: "idle",
};

export const addTransaction = createAsyncThunk(
  "transactions/add",
  async ({transaction, userId}:{transaction: Omit<Transaction, "Id">; userId: string }, {dispatch}) => {
     const newRef = await addDoc(getTransactionsRef(userId), transaction);
    
    // 2. Create full transaction object WITH id
    const newTransaction: Transaction = {
      ...transaction,
      id: newRef.id  // Add id separately
    };
    
    // 3. Update budget
    await updateBudgetOnTransaction(newTransaction, userId);
    
    // 4. Return for Redux store
    return newTransaction;
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers:{},
  extraReducers: (builder) => {
    builder.addCase(addTransaction.fulfilled, (state, action) => {
      state.items.push(action.payload)
    });
  },
});

export default transactionsSlice.reducer;