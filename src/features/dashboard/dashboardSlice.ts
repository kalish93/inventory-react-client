import { createSlice } from "@reduxjs/toolkit";

interface DashboardState {
  expenses: any;
  bankPositions: any;
  loading: boolean;
  error: any | null;
  isError: boolean;
}

const initialState: DashboardState = {
  expenses: undefined,
  bankPositions: undefined,
  loading: false,
  error: null,
  isError: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    dashboardStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
    },

    getExpensesSuccess: (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
    },

    getBankExpensesSuccess: (state, action) => {
        state.loading = false;
        state.bankPositions = action.payload;
    },

    dashboardFailure: (state, action) => {
      state.loading = false;
      state.isError = true;
      state.error = action.payload;
    },
  },
});

export const {
  dashboardStart,
  getExpensesSuccess,
  dashboardFailure,
  getBankExpensesSuccess
} = dashboardSlice.actions;

export const selectDashboard = (state: { dashboard: DashboardState }) => state.dashboard;

export default dashboardSlice.reducer;
