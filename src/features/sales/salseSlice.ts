import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";

interface SalesState {
  sales: PaginatedList<any>;
  loading: boolean;
  error: any | null;
  sale: any;
}

const initialState: SalesState = {
  sales: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1
  },
  loading: false,
  error: null,
  sale: null
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    getSalesStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    getSalesSuccess: (state, action) => {
        state.sales = action.payload;
        state.loading = false;
      },
    getSalesFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    },

    registerSaleStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      registerSaleSuccess: (state, action) => {
          const newUser = action.payload;
          state.sales = {
              items: [newUser, ...(state.sales?.items || [])],
              totalCount: (state.sales?.totalCount || 0) + 1,
              pageSize: state.sales?.pageSize || 10, 
              currentPage: state.sales?.currentPage || 1, 
              totalPages: state.sales?.totalPages || 1, 
          };
  
          state.loading = false;
          
      },
      registerSaleFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },

      getSaleByIdStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      getSaleByIdSuccess: (state, action) => {
        state.sale = action.payload;
        state.loading = false;
      },
      getSaleByIdFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
  },
});

export const {
  getSalesStart,
  getSalesSuccess,
  getSalesFailure,
  registerSaleStart,
  registerSaleSuccess,
  registerSaleFailure,
  getSaleByIdStart,
  getSaleByIdSuccess,
  getSaleByIdFailure
} = salesSlice.actions;

export const selectSale = (state: { sale: SalesState }) => state.sale;

export default salesSlice.reducer;
