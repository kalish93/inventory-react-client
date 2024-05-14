import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { Supplier } from "../../models/supplier";

interface SupplierState {
  suppliers: PaginatedList<Supplier>;
  loading: boolean;
  error: any | null;
  isError: boolean;
  successMessage: string | null;
  supplierPayments: PaginatedList<any>;
  supplierPurchases: PaginatedList<any>;
  supplier: any;
}

const initialState: SupplierState = {
  suppliers: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1
  },
  supplierPayments: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1
  },
  supplierPurchases: {
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
  supplier: null
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
        state.successMessage = null;
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
          state.successMessage = "Supplier Created Successfully.";
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
  

      updateSupplierStart: (state) => {
        state.loading = true;
        state.error = null;
        state.isError = false;
        state.successMessage = null;
      },
  
      updateSupplierSuccess: (state, action) => {
        const updatedSupplier = action.payload;
        state.suppliers = {
          items:
            state.suppliers?.items?.map((supplier) =>
              supplier.id === updatedSupplier.id ? updatedSupplier : supplier
            ) ?? [],
          totalCount: state.suppliers?.totalCount || 0,
          pageSize: state.suppliers?.pageSize || 10,
          currentPage: state.suppliers?.currentPage || 1,
          totalPages: state.suppliers?.totalPages || 1,
        };
        state.loading = false;
        state.successMessage = "Supplier Updated Successfully.";
      },
  
      updateSupplierFailure: (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      },
      getSupplierPaymentsSuccess: (state, action) => {
        state.loading = false;
        state.supplierPayments = action.payload;
      },
      getSupplierPurchasesSuccess: (state, action) => {
        state.loading = false;
        state.supplierPurchases = action.payload;
      },
      getSupplierSuccess: (state, action) => {
        state.loading = false;
        state.supplier = action.payload;
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
  deleteSupplierSuccess,
  updateSupplierFailure,
  updateSupplierStart,
  updateSupplierSuccess,
  getSupplierPaymentsSuccess,
  getSupplierPurchasesSuccess,
  getSupplierSuccess
} = supplierSlice.actions;

export const selectSupplier = (state: { supplier: SupplierState }) => state.supplier;

export default supplierSlice.reducer;
