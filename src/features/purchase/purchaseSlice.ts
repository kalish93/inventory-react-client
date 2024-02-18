import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { Purchase } from "../../models/purchase";

interface PurchaseState {
  purchases: PaginatedList<Purchase>;
  loading: boolean;
  error: any | null;
}

const initialState: PurchaseState = {
  purchases: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1
  },
  loading: false,
  error: null,
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
      },
      registerPurchaseSuccess: (state, action) => {
          const newUser = action.payload;
          state.purchases = {
              items: [newUser, ...(state.purchases?.items || [])],
              totalCount: (state.purchases?.totalCount || 0) + 1,
              pageSize: state.purchases?.pageSize || 10, 
              currentPage: state.purchases?.currentPage || 1, 
              totalPages: state.purchases?.totalPages || 1, 
          };
  
          state.loading = false;
          
      },
      registerPurchaseFailure: (state, action) => {
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
  registerPurchaseFailure
} = purchaseSlice.actions;

export const selectPurchase = (state: { purchase: PurchaseState }) => state.purchase;

export default purchaseSlice.reducer;