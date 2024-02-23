import { createSlice,  PayloadAction } from "@reduxjs/toolkit";
import { Store } from "../../models/store";
import { PaginatedList } from "../../models/commons/paginatedList";

interface StoreState {
  stores: PaginatedList<Store>;
  loading: boolean;
  error: any | null;
  isError: boolean;
}

const initialState: StoreState = {
  stores: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  loading: false,
  error: null,
  isError: false,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    storeStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
    },
    storeFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.isError = true;
    },
    getStoreSuccess: (state, action: PayloadAction<PaginatedList<Store>>) => {
      state.stores = action.payload;
      state.loading = false;
    },
    createStoreSuccess: (state, action: PayloadAction<Store>) => {
      const newStore = action.payload;
      state.stores = {
        items: [ newStore, ...(state.stores?.items || [])],
        totalCount: (state.stores?.totalCount || 0) + 1,
        pageSize: state.stores?.pageSize || 10,
        currentPage: state.stores?.currentPage || 1,
        totalPages: state.stores?.totalPages || 1,
      };
      state.loading = false;
    },
    deleteStoreSuccess: (state, action: PayloadAction<number>) => {
      const storeId = action.payload;
      state.stores = {
        items:
          state.stores?.items?.filter((store) => store.id !== storeId) || [],
        totalCount: (state.stores?.totalCount || 0) - 1,
        pageSize: state.stores?.pageSize || 10,
        currentPage: state.stores?.currentPage || 1,
        totalPages: state.stores?.totalPages || 1,
      };
      state.loading = false;
    },
    updateStoreSuccess: (state, action: PayloadAction<Store>) => {
      const updatedStore = action.payload;
      state.stores = {
        items:
          state.stores?.items?.map((store) =>
            store.id === updatedStore.id ? updatedStore : store
          ) || [],
        totalCount: state.stores?.totalCount || 0,
        pageSize: state.stores?.pageSize || 10,
        currentPage: state.stores?.currentPage || 1,
        totalPages: state.stores?.totalPages || 1,
      };
      state.loading = false;
    },
  },
});

export const {
  storeStart,
  storeFailure,
  getStoreSuccess,
  createStoreSuccess,
  deleteStoreSuccess,
  updateStoreSuccess,
} = storeSlice.actions;

export const selectStore = (state: { store: StoreState }) =>
  state.store;

export default storeSlice.reducer;
