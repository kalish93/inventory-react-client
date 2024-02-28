import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { Customer } from "../../models/customer";

interface CustomerState {
  customers: PaginatedList<Customer>;
  loading: boolean;
  error: any | null;
  isError: boolean;
  successMessage: string | null;
}

const initialState: CustomerState = {
  customers: {
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

const customerSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getCustomersStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    getCustomersSuccess: (state, action) => {
        state.customers = action.payload;
        state.loading = false;
      },
    getCustomersFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    },

    registerCustomerStart: (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
        state.isError = false;
      },
      registerCustomerSuccess: (state, action) => {
          const newCustomer = action.payload;
          state.customers = {
              items: [newCustomer, ...(state.customers?.items || [])],
              totalCount: (state.customers?.totalCount || 0) + 1,
              pageSize: state.customers?.pageSize || 10, 
              currentPage: state.customers?.currentPage || 1, 
              totalPages: state.customers?.totalPages || 1, 
          };
  
          state.loading = false;
          state.successMessage = "Customer registered sucessfully";
      },
      registerCustomerFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isError = true
      },


      deleteCustomerStart: (state) => {
        state.loading = true;
        state.error = null;
        state.isError = false
      },
      deleteCustomerSuccess: (state, action) => {
        const deletedCustomer = action.payload;
        state.customers = {
            items: state.customers?.items.filter(user => user.id !== deletedCustomer.id) || [],
            totalCount: (state.customers?.totalCount || 0) - 1,
            pageSize: state.customers?.pageSize || 10, 
            currentPage: state.customers?.currentPage || 1, 
            totalPages: state.customers?.totalPages || 1, 
        };
        state.loading = false;      
      },
      deleteCustomerFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isError = true
      },

      updateCustomerStart: (state) => {
        state.loading = true;
        state.error = null;
        state.isError = false
        state.successMessage = null
      },
      updateCustomerSuccess: (state, action) => {
          const updatedCustomer = action.payload;
          const customerIndex = state.customers.items.findIndex(customer => customer.id === updatedCustomer.id);
          if (customerIndex !== -1) {
              state.customers.items = state.customers.items.map(customer => (customer.id === updatedCustomer.id ? updatedCustomer : customer));
          } else {
              state.customers.items = [updatedCustomer, ...state.customers.items];
          }
          state.loading = false;
          state.successMessage = "Customer updated successfully";
      },
      updateCustomerFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isError = true
      },
  
  
  },
});

export const {
  getCustomersStart,
  getCustomersSuccess,
  getCustomersFailure,
  registerCustomerStart,
  registerCustomerSuccess,
  registerCustomerFailure,
  deleteCustomerFailure,
  deleteCustomerStart,
  deleteCustomerSuccess,
  updateCustomerFailure,
  updateCustomerStart,
  updateCustomerSuccess
} = customerSlice.actions;

export const selectCustomer = (state: { customer: CustomerState }) => state.customer;

export default customerSlice.reducer;
