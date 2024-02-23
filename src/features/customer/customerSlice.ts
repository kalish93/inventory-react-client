import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { Customer } from "../../models/customer";

interface CustomerState {
  customers: PaginatedList<Customer>;
  loading: boolean;
  error: any | null;
  isError: boolean;
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
  isError: false
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
        state.isError = false;
      },
      registerCustomerSuccess: (state, action) => {
          const newUser = action.payload;
          state.customers = {
              items: [...(state.customers?.items || []), newUser],
              totalCount: (state.customers?.totalCount || 0) + 1,
              pageSize: state.customers?.pageSize || 10, 
              currentPage: state.customers?.currentPage || 1, 
              totalPages: state.customers?.totalPages || 1, 
          };
  
          state.loading = false;
          
      },
      registerCustomerFailure: (state, action) => {
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
  registerCustomerFailure
} = customerSlice.actions;

export const selectCustomer = (state: { customer: CustomerState }) => state.customer;

export default customerSlice.reducer;
