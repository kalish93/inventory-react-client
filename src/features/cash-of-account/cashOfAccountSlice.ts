import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";

interface CashOfAccountState {
  cashOfAccounts: PaginatedList<any>;
  loading: boolean;
  error: any | null;
}

const initialState: CashOfAccountState = {
    cashOfAccounts: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1
  },
  loading: false,
  error: null,
};

const cashOfAccountSlice = createSlice({
  name: "cashOfAccount",
  initialState,
  reducers: {
    getCashOfAccountsStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    getCashOfAccountsSuccess: (state, action) => {
        state.cashOfAccounts = action.payload;
        state.loading = false;
      },
    getCashOfAccountsFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    },

    registerCashOfAccountStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      registerCashOfAccountSuccess: (state, action) => {
          const newUser = action.payload;
          state.cashOfAccounts = {
              items: [...(state.cashOfAccounts?.items || []), newUser],
              totalCount: (state.cashOfAccounts?.totalCount || 0) + 1,
              pageSize: state.cashOfAccounts?.pageSize || 10, 
              currentPage: state.cashOfAccounts?.currentPage || 1, 
              totalPages: state.cashOfAccounts?.totalPages || 1, 
          };
  
          state.loading = false;
          
      },
      registerCashOfAccountFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
  },
});

export const {
  getCashOfAccountsStart,
  getCashOfAccountsSuccess,
  getCashOfAccountsFailure,
  registerCashOfAccountStart,
  registerCashOfAccountSuccess,
  registerCashOfAccountFailure
} = cashOfAccountSlice.actions;

export const selectCashOfAccount = (state: { cashOfAccount: CashOfAccountState }) => state.cashOfAccount;

export default cashOfAccountSlice.reducer;