import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bank } from "../../models/bank";
import { PaginatedList } from "../../models/commons/paginatedList";

interface BankState {
  banks: PaginatedList<Bank>;
  loading: boolean;
  error: any | null;
  isError: boolean;
  bank: any;
  successMessage: string | null;
}

const initialState: BankState = {
  banks: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  bank: undefined,
  loading: false,
  error: null,
  isError: false,
  successMessage: null,
};

const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {
    bankStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
      state.successMessage = null;
    },
    bankFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.isError = true;
    },
    getBankSuccess: (state, action: PayloadAction<PaginatedList<Bank>>) => {
      state.banks = action.payload;
      state.loading = false;
    },
    getBankByIdSuccess: (state, action: PayloadAction<Bank>) => {
      state.bank = action.payload;
      state.loading = false;
    },
    createBankSuccess: (state, action: PayloadAction<Bank>) => {
      const newBank = action.payload;
      state.banks = {
        items: [newBank, ...(state.banks?.items || [])],
        totalCount: (state.banks?.totalCount || 0) + 1,
        pageSize: state.banks?.pageSize || 10,
        currentPage: state.banks?.currentPage || 1,
        totalPages: state.banks?.totalPages || 1,
      };
      state.loading = false;
      state.successMessage = "Bank Created Succesfully.";
    },
    deleteBankSuccess: (state, action) => {
      const deletedBank = action.payload;
      state.banks = {
        items: state.banks?.items?.filter(
          (store) => store.id !== deletedBank.id
        ),
        totalCount: (state.banks?.totalCount || 0) - 1,
        pageSize: state.banks?.pageSize || 10,
        currentPage: state.banks?.currentPage || 1,
        totalPages: state.banks?.totalPages || 1,
      };
      state.loading = false;
      state.successMessage = "Bank Deleted Succesfully.";
    },
    updateBankSuccess: (state, action: PayloadAction<Bank>) => {
      const updatedBank = action.payload;
      state.banks = {
        items:
          state.banks?.items?.map((bank) =>
            bank.id === updatedBank.id ? updatedBank : bank
          ) || [],
        totalCount: state.banks?.totalCount || 0,
        pageSize: state.banks?.pageSize || 10,
        currentPage: state.banks?.currentPage || 1,
        totalPages: state.banks?.totalPages || 1,
      };
      state.loading = false;
      state.successMessage = "Bank Updated Succesfully.";
    },
  },
});

export const {
  bankStart,
  bankFailure,
  getBankSuccess,
  createBankSuccess,
  deleteBankSuccess,
  updateBankSuccess,
  getBankByIdSuccess,
} = bankSlice.actions;

export const selectBank = (state: { bank: BankState }) => state.bank;

export default bankSlice.reducer;
