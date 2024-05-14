import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { Product } from "../../models/product";

interface ProvisionState {
  provisions: PaginatedList<Product>;
  monthlyProvisions: any;
  loading: boolean;
  error: any | null;
  isError: boolean;
  successMessage: string | null;
  productCategories: any;
}

const initialState: ProvisionState = {
  monthlyProvisions: {
    items: [],
  },
  provisions: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  loading: false,
  error: null,
  isError: false,
  successMessage: null,
  productCategories: [],
};

const provisionSlice = createSlice({
  name: "provision",
  initialState,
  reducers: {
    getProvisionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getProvisionsSuccess: (state, action) => {
      state.provisions = action.payload;
      state.loading = false;
    },
    getMonthlyProvisionsSuccess: (state, action) => {
      state.monthlyProvisions = action.payload;
      state.loading = false;
    },
    getProvisionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getProvisionsStart,
  getProvisionsSuccess,
  getProvisionsFailure,
  getMonthlyProvisionsSuccess
} = provisionSlice.actions;

export const selectProvision = (state: { provision: ProvisionState }) =>
  state.provision;

export default provisionSlice.reducer;
