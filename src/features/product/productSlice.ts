import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { Product } from "../../models/product";

interface ProductState {
  products: PaginatedList<Product>;
  loading: boolean;
  error: any | null;
}

const initialState: ProductState = {
  products: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1
  },
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getProductsStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    getProductsSuccess: (state, action) => {
        state.products = action.payload;
        state.loading = false;
      },
    getProductsFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    },

    registerProductStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      registerProductSuccess: (state, action) => {
          const newUser = action.payload;
          state.products = {
              items: [...(state.products?.items || []), newUser],
              totalCount: (state.products?.totalCount || 0) + 1,
              pageSize: state.products?.pageSize || 10, 
              currentPage: state.products?.currentPage || 1, 
              totalPages: state.products?.totalPages || 1, 
          };
  
          state.loading = false;
          
      },
      registerProductFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
  },
});

export const {
  getProductsStart,
  getProductsSuccess,
  getProductsFailure,
  registerProductStart,
  registerProductSuccess,
  registerProductFailure
} = productSlice.actions;

export const selectProduct = (state: { product: ProductState }) => state.product;

export default productSlice.reducer;
