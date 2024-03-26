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

    updatePurchaseSuccess: (state, action) => {
      const updatedPurchase = action.payload;
      state.purchases = {
        items:
          state.purchases?.items?.map((purchase) =>
            purchase.id === updatedPurchase.id ? updatedPurchase : purchase
          ) ?? [],
        totalCount: state.purchases?.totalCount || 0,
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
    registerTransportCostSuccess: (state, action) => {
      const newTransportCost = action.payload;
      state.transportCosts = {
        items: [newTransportCost, ...(state.transportCosts?.items || [])],
        totalCount: (state.transportCosts?.totalCount || 0) + 1,
        pageSize: state.transportCosts?.pageSize || 10,
        currentPage: state.transportCosts?.currentPage || 1,
        totalPages: state.transportCosts?.totalPages || 1,
      };

      state.loading = false;
    },
    getEslCustomCosts: (state, action) => {
      state.eslCosts = action.payload;
      state.loading = false;
    },

    createEslCustomCostSuccess: (state, action) => {
      const newEslCost = action.payload;
      state.eslCosts = {
        items: [newEslCost, ...(state.eslCosts?.items || [])],
        totalCount: (state.eslCosts?.totalCount || 0) + 1,
        pageSize: state.eslCosts?.pageSize || 10,
        currentPage: state.eslCosts?.currentPage || 1,
        totalPages: state.eslCosts?.totalPages || 1,
      };
    },
    getTransitFees: (state, action) => {
      state.transitFees = action.payload;
      state.loading = false;
    },

    createTransitFeeSuccess: (state, action) => {
      const newTransitFee = action.payload;
      state.transitFees = {
        items: [newTransitFee, ...(state.transitFees?.items || [])],
        totalCount: (state.transitFees?.totalCount || 0) + 1,
        pageSize: state.transitFees?.pageSize || 10,
        currentPage: state.transitFees?.currentPage || 1,
        totalPages: state.transitFees?.totalPages || 1,
      };
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
  getTransportCosts,
  updatePurchaseSuccess,
  registerTransportCostSuccess,
  createEslCustomCostSuccess,
  createTransitFeeSuccess,
} = purchaseSlice.actions;

export const selectPurchase = (state: { purchase: PurchaseState }) =>
  state.purchase;

export default purchaseSlice.reducer;
