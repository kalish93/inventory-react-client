import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";

interface CashOfAccountState {
  cashOfAccounts: PaginatedList<any>;
  loading: boolean;
  error: any | null;
  banks: any;
  expenses: any;
}

const initialState: CashOfAccountState = {
  cashOfAccounts: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  loading: false,
  error: null,
  banks: [],
  expenses: [],
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

    getBanksSuccess: (state, action) => {
      state.banks = action.payload;
      state.loading = false;
    },
    getExpensesSuccess: (state, action) => {
      state.expenses = action.payload;
      state.loading = false;
    },
    registerBanksSuccess: (state, action) => {
      state.banks = [action.payload, ...state.banks];
      state.loading = false;
    },

    registerExpensesSuccess: (state, action) => {
      state.expenses = [action.payload, ...state.expenses];
      state.loading = false;
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
  registerCashOfAccountFailure,
  getBanksSuccess,
  getExpensesSuccess,
  registerBanksSuccess,
  registerExpensesSuccess,
} = cashOfAccountSlice.actions;

export const selectCashOfAccount = (state: {
  cashOfAccount: CashOfAccountState;
}) => state.cashOfAccount;

export default cashOfAccountSlice.reducer;
