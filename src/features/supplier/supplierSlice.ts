import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { Supplier } from "../../models/supplier";

interface SupplierState {
  suppliers: PaginatedList<Supplier>;
  loading: boolean;
  error: any | null;
  isError: boolean;
}

const initialState: SupplierState = {
  suppliers: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1
  },
  loading: false,
  error: null,
  isError: false,
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    getSuppliersStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    getSuppliersSuccess: (state, action) => {
        state.suppliers = action.payload;
        state.loading = false;
      },
    getSuppliersFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    },

    registerSupplierStart: (state) => {
        state.loading = true;
        state.error = null;
        state.isError = false;
      },
      registerSupplierSuccess: (state, action) => {
          const newSupplier = action.payload;
          state.suppliers = {
              items: [newSupplier, ...(state.suppliers?.items || [])],
              totalCount: (state.suppliers?.totalCount || 0) + 1,
              pageSize: state.suppliers?.pageSize || 10, 
              currentPage: state.suppliers?.currentPage || 1, 
              totalPages: state.suppliers?.totalPages || 1, 
          };
  
          state.loading = false;
          
      },
      registerSupplierFailure: (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      },

      deleteSupplierStart: (state) => {
        state.loading = true;
        state.error = null;
        state.isError = false
      },
      deleteSupplierSuccess: (state, action) => {
        const deletedsupplier = action.payload;
        state.suppliers = {
            items: state.suppliers?.items.filter(supplier => supplier.id !== deletedsupplier.id) || [],
            totalCount: (state.suppliers?.totalCount || 0) - 1,
            pageSize: state.suppliers?.pageSize || 10, 
            currentPage: state.suppliers?.currentPage || 1, 
            totalPages: state.suppliers?.totalPages || 1, 
        };
        state.loading = false;
          
      },
      deleteSupplierFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isError = true
      },
  
  },
});

export const {
  getSuppliersStart,
  getSuppliersSuccess,
  getSuppliersFailure,
  registerSupplierStart,
  registerSupplierSuccess,
  registerSupplierFailure,
  deleteSupplierFailure,
  deleteSupplierStart,
  deleteSupplierSuccess
} = supplierSlice.actions;

export const selectSupplier = (state: { supplier: SupplierState }) => state.supplier;

export default supplierSlice.reducer;
