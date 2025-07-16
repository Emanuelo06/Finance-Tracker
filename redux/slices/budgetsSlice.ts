import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Budget, getBudgetsRef} from "@/lib/firestore";
import { addDoc } from "firebase/firestore";

export const createBudget = createAsyncThunk(
  "budgets/create",
  async ({ budget, userId} : {budget: Omit<Budget, "id">; userId: string })=> {
    const newRef = await addDoc(getBudgetsRef(userId), budget);
    return{ id: newRef.id, ...budget};
  }
);

const budgetsSlice = createSlice({
  name: "budgets",
  initialState: {
    items: [] as Budget[],
    status: "idle" as "idle" | "loading" | "succeded"| "failed"
  },
  reducers: {},
    extraReducers: (builder) => {
    builder.addCase(createBudget.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
  },
});

export default budgetsSlice.reducer