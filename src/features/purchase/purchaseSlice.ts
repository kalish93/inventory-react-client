import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { Purchase } from "../../models/purchase";

interface PurchaseState {
  purchases: PaginatedList<Purchase>;
  transportCosts: PaginatedList<any>;
  eslCosts: PaginatedList<any>;
  transitFees: PaginatedList<any>;
  loading: boolean;
  error: any | null;
  purchase: any;
  isError: boolean;
}

const initialState: PurchaseState = {
  purchases: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  transportCosts: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  eslCosts: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  transitFees: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  loading: false,
  error: null,
  purchase: undefined,
  isError: false,
};

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    getPurchasesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getPurchasesSuccess: (state, action) => {
      state.purchases = action.payload;
      state.loading = false;
    },
    getPurchasesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    registerPurchaseStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
    },
    registerPurchaseSuccess: (state, action) => {
      const newPurchase = action.payload;
      state.purchases = {
        items: [newPurchase, ...(state.purchases?.items || [])],
        totalCount: (state.purchases?.totalCount || 0) + 1,
        pageSize: state.purchases?.pageSize || 10,
        currentPage: state.purchases?.currentPage || 1,
        totalPages: state.purchases?.totalPages || 1,
      };

      state.loading = false;
    },
    registerPurchaseFailure: (state, action) => {
      state.loading = false;
      state.isError = true;
      state.error = action.payload;
    },

    getPurchaseByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getPurchaseByIdSuccess: (state, action) => {
      state.purchase = action.payload;
      state.loading = false;
    },
    getPurchaseByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deletePurchaseSuccess: (state, action) => {
      const deletedPurchase = action.payload;
      state.purchases = {
        items:
          state.purchases?.items.filter(
            (purchase) => purchase.id !== deletedPurchase.id
          ) || [],
        totalCount: (state.purchases?.totalCount || 0) - 1,
        pageSize: state.purchases?.pageSize || 10,
        currentPage: state.purchases?.currentPage || 1,
        totalPages: state.purchases?.totalPages || 1,
      };
      state.loading = false;
    },


    getPurchaseCostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTransportCosts: (state, action) => {
      state.transportCosts = action.payload;
      state.loading = false;
    },
    getEslCustomCosts: (state, action) => {
      state.eslCosts = action.payload;
      state.loading = false;
    },
    getTransitFees: (state, action) => {
      state.transitFees = action.payload;
      state.loading = false;
    },
    getPurchaseCostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getPurchasesStart,
  getPurchasesSuccess,
  getPurchasesFailure,
  registerPurchaseStart,
  registerPurchaseSuccess,
  registerPurchaseFailure,
  getPurchaseByIdStart,
  getPurchaseByIdSuccess,
  getPurchaseByIdFailure,
  deletePurchaseSuccess,
  getEslCustomCosts,
  getPurchaseCostsFailure,
  getPurchaseCostsStart,
  getTransitFees,
  getTransportCosts
} = purchaseSlice.actions;

export const selectPurchase = (state: { purchase: PurchaseState }) =>
  state.purchase;

export default purchaseSlice.reducer;
