import { AppDispatch } from "../../app/store";
import { RoleService } from "./roleService";
import { assignRevokePermissionsFailure, assignRevokePermissionsStart, assignRevokePermissionsSuccess, createRoleFailure, createRoleStart, createRoleSuccess, deleteRoleFailure, deleteRoleStart, deleteRoleSuccess, getRolePermissionsFailure, getRolesFailure, getRolesPermissionsStart, getRolesPermissionsSuccess, getRolesStart, getRolesSuccess, updateRoleFailure, updateRoleStart, updateRoleSuccess } from "./roleSlice";

export const getRoles = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(getRolesStart());
      const response = await RoleService.getRoles();
      dispatch(getRolesSuccess(response));
    } catch (error) {
      dispatch(getRolesFailure(error));
    }
  };

export const getRolePermissions = (id: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(getRolesPermissionsStart());

    const response = await RoleService.getRolePermissions(id);

    if (response.success) {
      dispatch(getRolesPermissionsSuccess(response.data));
    } else {
      dispatch(getRolePermissionsFailure(response.error || 'Unknown error'));
    }
  } catch (error) {
    dispatch(getRolePermissionsFailure('Unknown error'));
  }
};

export const assignRevokePermissions = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(assignRevokePermissionsStart());

    const response = await RoleService.assignRevokePermissions(data);

    if (response.success) {
      dispatch(assignRevokePermissionsSuccess(response.data));
    } else {
      dispatch(assignRevokePermissionsFailure(response.error || 'Unknown error'));
    }
  } catch (error) {
    dispatch(assignRevokePermissionsFailure('Unknown error'));
  }
};

export const deleteRole = (id: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(deleteRoleStart());

    const response = await RoleService.deleteRole(id);

    if (response.success) {
      dispatch(deleteRoleSuccess(response.data));
    } else {
      dispatch(deleteRoleFailure(response.error || 'Unknown error'));
    }
  } catch (error) {
    dispatch(deleteRoleFailure('Unknown error'));
  }
};
export const createRole = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(createRoleStart());

    const response = await RoleService.createRole(data);

    if (response.success) {
      dispatch(createRoleSuccess(response.data));
    } else {
      dispatch(createRoleFailure(response.error || 'Unknown error'));
    }
  } catch (error) {
    dispatch(createRoleFailure('Unknown error'));
  }
};
export const updateRole = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(updateRoleStart());

    const response = await RoleService.updateRole(data);

    if (response.success) {
      dispatch(updateRoleSuccess(response.data));
    } else {
      dispatch(updateRoleFailure(response.error || 'Unknown error'));
    }
  } catch (error) {
    dispatch(updateRoleFailure('Unknown error'));
  }
};