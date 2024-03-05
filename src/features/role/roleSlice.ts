import { createSlice } from "@reduxjs/toolkit";
import { Role } from "../../models/role";

interface RoleState {
  roles: Role[];
  loading: boolean;
  error: any | null;
  rolePermissions: any;
  isError: boolean;
  successMessage: any;
}

const initialState: RoleState = {
  roles: [],
  loading: false,
  error: null,
  rolePermissions: [],
  isError: false,
  successMessage: null
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    getRolesStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
    },
    getRolesSuccess: (state, action) => {
      state.roles = action.payload;
      state.loading = false;
    },

    getRolesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isError = true;
    },

    getRolesPermissionsStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
    },
    getRolesPermissionsSuccess: (state, action) => {
      state.rolePermissions = action.payload;
      state.loading = false;
    },

    getRolePermissionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isError = true;
    },

    assignRevokePermissionsStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
    },

    assignRevokePermissionsSuccess: (state, action) => {
      state.rolePermissions = action.payload;
      state.loading = false;
    },

    assignRevokePermissionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isError = true;
    },

    deleteRoleStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
    },

    deleteRoleSuccess: (state, action) => {
      const deletedRole = action.payload
      state.roles = state.roles?.filter(role => role.id !== deletedRole.id);
      state.loading = false;
    },

    deleteRoleFailure: (state, action) => {
      state.loading = false;
      state.isError = true;
      state.error = action.payload;
    },
    createRoleStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
    },

    createRoleSuccess: (state, action) => {
      state.roles = [action.payload, ...state.roles]
      state.loading = false;
      state.successMessage = 'Role Created Successfully.'
    },

    createRoleFailure: (state, action) => {
      state.loading = false;
      state.isError = true;
      state.error = action.payload;
    },

    updateRoleStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
    },

    updateRoleSuccess: (state, action) => {
      const updatedRole = action.payload;
      const roleIndex = state.roles.findIndex(
        (role) => role.id === updatedRole.id
      );
      if (roleIndex !== -1) {
        state.roles = state.roles.map((role) =>
          role.id === updatedRole.id ? updatedRole : role
        );
      } else {
        state.roles = [updatedRole, ...state.roles];
      }
      state.loading = false;
      state.successMessage = 'Role Updated Successfully.'
    },

    updateRoleFailure: (state, action) => {
      state.loading = false;
      state.isError = true;
      state.error = action.payload;
    },
  },
});

export const {
    getRolesStart,
    getRolesSuccess,
    getRolesFailure,
    getRolePermissionsFailure,
    getRolesPermissionsStart,
    getRolesPermissionsSuccess,
    assignRevokePermissionsFailure,
    assignRevokePermissionsStart,
    assignRevokePermissionsSuccess,
    deleteRoleFailure,
    deleteRoleStart,
    deleteRoleSuccess,
    createRoleFailure,
    createRoleStart,
    createRoleSuccess,
    updateRoleFailure,
    updateRoleStart,
    updateRoleSuccess
  } = roleSlice.actions;
  
export const selectRoles = (state: { roles: RoleState }) => state.roles; 

export default roleSlice.reducer;