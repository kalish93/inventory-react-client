import { createSlice} from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { CATransaction } from "../../models/ca-transaction";

interface CATransactionState {
    transactions: PaginatedList<CATransaction>;
    loading: boolean;
    error: any | null;
    isError: boolean;
}

const initialState: CATransactionState = {
    transactions: {
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
        getTransactionsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createTransactionStart: (state) => {
            state.loading = true;
            state.error = null;
            state.isError = false;
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
    },
});

export const {
    getTransactionsStart,
    getTransactionsSuccess,
    getTransactionsFailure,
    createTransactionStart,
    createTransactionSuccess,
    createTransactionFailure,
} = transactionSlice.actions;

export const selectTransactions = (state: {caTransaction: CATransactionState}) => state.caTransaction;

export default transactionSlice.reducer;