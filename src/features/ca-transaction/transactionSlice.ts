import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { CATransaction } from "../../models/ca-transaction";

interface CATransactionState {
  monthlyTransactions: PaginatedList<CATransaction>;
  transactions: PaginatedList<CATransaction>;
  transitPayments: PaginatedList<any>;
  loading: boolean;
  error: any | null;
  isError: boolean;
}

const initialState: CATransactionState = {
  monthlyTransactions: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  transactions: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  transitPayments: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  loading: false,
  error: null,
  isError: false,
};

const transactionSlice = createSlice({
  name: "caTransaction",
  initialState,
  reducers: {
    getTransactionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTransactionsSuccess: (state, action) => {
      state.transactions = action.payload;
      state.loading = false;
    },
    getMonthlyTransactionsSuccess: (state, action) => {
      state.monthlyTransactions = action.payload;
      state.loading = false;
    },
    getTransitPaymentsSuccess: (state, action) => {
      state.transitPayments = action.payload;
      state.loading = false;
    },
    getTransactionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createTransactionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
    },
    createTransitPaymentSuccess: (state, action) => {
      const newTransitPayment = action.payload;
      state.transitPayments = {
        items: [newTransitPayment, ...(state.transitPayments?.items || [])],
        totalCount: (state.transitPayments?.totalCount || 0) + 1,
        pageSize: state.transitPayments?.pageSize || 10,
        currentPage: state.transitPayments?.currentPage || 1,
        totalPages: state.transitPayments?.totalPages || 1,
      };
      state.loading = false;
    },
    createTransactionSuccess: (state, action) => {
      const newTransaction = action.payload;
      state.transactions = {
        items: [newTransaction, ...(state.transactions?.items || [])],
        totalCount: (state.transactions?.totalCount || 0) + 1,
        pageSize: state.transactions?.pageSize || 10,
        currentPage: state.transactions?.currentPage || 1,
        totalPages: state.transactions?.totalPages || 1,
      };
      state.loading = false;
    },
    createTransactionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isError = true;
    },

    createJournalEntrySuccessSuccess: (state, action) => {
      const newTransactions = action.payload;
      state.transactions = {
        items: [
          newTransactions.firstTransaction,
          newTransactions.secondTransaction,
          ...(state.transactions?.items || []),
        ],
        totalCount: (state.transactions?.totalCount || 0) + 2,
        pageSize: state.transactions?.pageSize || 10,
        currentPage: state.transactions?.currentPage || 1,
        totalPages: state.transactions?.totalPages || 1,
      };
      state.loading = false;
    },

    deleteJournalEntrySuccess: (state, action) => {
      const deleted = action.payload;
      const deletedIds = deleted.map((item: { id: any }) => item.id);
      state.transactions = {
        items:
          state.transactions?.items.filter(
            (transaction) => !deletedIds.includes(transaction.id)
          ) || [],
        totalCount: (state.transactions?.totalCount || 0) - deletedIds.length,
        pageSize: state.transactions?.pageSize || 10,
        currentPage: state.transactions?.currentPage || 1,
        totalPages: state.transactions?.totalPages || 1,
      };
      state.loading = false;
    },
  },
});

export const {
  getTransactionsStart,
  getTransactionsSuccess,
  getMonthlyTransactionsSuccess,
  getTransactionsFailure,
  createTransactionStart,
  createTransactionSuccess,
  createTransactionFailure,
  createTransitPaymentSuccess,
  getTransitPaymentsSuccess,
  createJournalEntrySuccessSuccess,
  deleteJournalEntrySuccess,
} = transactionSlice.actions;

export const selectTransactions = (state: {
  caTransaction: CATransactionState;
}) => state.caTransaction;

export default transactionSlice.reducer;
