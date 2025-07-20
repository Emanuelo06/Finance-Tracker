import { getTransactionsRef } from "@/lib/firestore";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc,  } from "firebase/firestore";
import { Transaction } from "@/lib/firestore";
import { revertBudgetOnTransaction, updateBudgetOnTransaction } from "@/lib/financeCalculations";
interface TransactionState {
  data: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  data: [],
  loading: false,
  error: null,
}

export const addTransaction = createAsyncThunk(
  "transactions/add",
    async (
    { transaction, userId }: { transaction: Omit<Transaction, "id">; userId: string },
    { dispatch }
    ) => {
      const newRef = await addDoc(getTransactionsRef(userId),transaction)

      const newTransaction : Transaction = {
        ...transaction,
        id: newRef.id
      };

      await updateBudgetOnTransaction(newTransaction, userId);

      return newTransaction
    }
);

export const deleteTransaction =  createAsyncThunk(
  "transactions/delete",
  async (
    {transaction, userId} : { transaction: Transaction; userId: string}
  ) => {
    const transactionRef = doc(getTransactionsRef(userId), transaction.id);
    await deleteDoc(transactionRef);

    await revertBudgetOnTransaction(transaction, userId);

    return transaction.id
  }
)

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>){
      state.data = action.payload
    }
  },
  extraReducers: (builder)=> {
    builder
      //add
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add transaction";
      })

      //delete
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (tx) => tx.id !== action.payload
        );
        state.loading = false
      })

      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete transaction"
      })
  }
});
export const {setTransactions} = transactionSlice.actions
export default transactionSlice.reducer;