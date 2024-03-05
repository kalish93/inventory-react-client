import { createSlice } from "@reduxjs/toolkit";

interface PermissionState {
  permissions: any;
  loading: boolean;
  error: any | null;
  isError: boolean

}

const initialState: PermissionState = {
  permissions: [],
  loading: false,
  error: null,
  isError: false,
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    getPermissionsStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    getPermissionsSuccess: (state, action) => {
        state.permissions = action.payload;
        state.loading = false;
      },
    getPermissionsFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    },
  },
});

export const {
  getPermissionsStart,
  getPermissionsSuccess,
  getPermissionsFailure
} = permissionSlice.actions;

export const selectInventory = (state: { permission : PermissionState }) => state.permission;
export default permissionSlice.reducer;
