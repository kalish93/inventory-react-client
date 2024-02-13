import { createSlice } from "@reduxjs/toolkit";
import { Role } from "../../models/role";

interface RoleState {
  roles: Role[];
  loading: boolean;
  error: any | null;
}

const initialState: RoleState = {
  roles: [],
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    getRolesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getRolesSuccess: (state, action) => {
      state.roles = action.payload;
      state.loading = false;
    },

    getRolesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});


export const {
    getRolesStart,
    getRolesSuccess,
    getRolesFailure
  } = roleSlice.actions;
  
export const selectRoles = (state: { roles: RoleState }) => state.roles; 

export default roleSlice.reducer;