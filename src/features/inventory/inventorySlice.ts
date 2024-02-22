import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";

interface InventoryState {
  inventories: PaginatedList<any>;
  loading: boolean;
  error: any | null;
  isError: boolean

}

const initialState: InventoryState = {
  inventories: {
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

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    getInventoriesStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    getInventoriesSuccess: (state, action) => {
        state.inventories = action.payload;
        state.loading = false;
      },
    getInventoriesFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    },
  },
});

export const {
  getInventoriesStart,
  getInventoriesSuccess,
  getInventoriesFailure
} = inventorySlice.actions;

export const selectInventory = (state: { inventory: InventoryState }) => state.inventory;
export default inventorySlice.reducer;
