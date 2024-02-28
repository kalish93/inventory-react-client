import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { Product } from "../../models/product";

interface ProductState {
  products: PaginatedList<Product>;
  loading: boolean;
  error: any | null;
  isError: boolean;
  successMessage: string | null;
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
  isError: false,
  successMessage: null,
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
        state.isError = false;
      },
      registerProductSuccess: (state, action) => {
          const newProduct = action.payload;
          state.products = {
              items: [newProduct, ...(state.products?.items || [])],
              totalCount: (state.products?.totalCount || 0) + 1,
              pageSize: state.products?.pageSize || 10, 
              currentPage: state.products?.currentPage || 1, 
              totalPages: state.products?.totalPages || 1, 
          };
  
          state.loading = false;
          state.successMessage = "product Created Successfully.";
      },
      registerProductFailure: (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      },

      deleteProductStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      deleteProductSuccess: (state, action) => {
        const productToDelete = action.payload;
        state.products = {
          items:
            state.products?.items?.filter(
              (product) => product.id !== productToDelete.id
            ) ?? [],
          totalCount: (state.products?.totalCount || 0) - 1,
          pageSize: state.products?.pageSize || 10,
          currentPage: state.products?.currentPage || 1,
          totalPages: state.products?.totalPages || 1,
        };
        state.loading = false;
      },
      deleteproductFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },

      updateProductStart: (state) => {
        state.loading = true;
        state.error = null;
        state.isError = false;
        state.successMessage = null;
      },
  
      updateProductSuccess: (state, action) => {
        const updatedProduct = action.payload;
        state.products = {
          items:
            state.products?.items?.map((product) =>
              product.id === updatedProduct.id ? updatedProduct : product
            ) ?? [],
          totalCount: state.products?.totalCount || 0,
          pageSize: state.products?.pageSize || 10,
          currentPage: state.products?.currentPage || 1,
          totalPages: state.products?.totalPages || 1,
        };
        state.loading = false;
        state.successMessage = "product Updated Successfully.";
      },
  
      updateproductFailure: (state, action) => {
        state.loading = false;
        state.isError = true;
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
  registerProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteproductFailure,
  updateProductStart,
  updateProductSuccess,
  updateproductFailure
} = productSlice.actions;

export const selectProduct = (state: { product: ProductState }) => state.product;

export default productSlice.reducer;
