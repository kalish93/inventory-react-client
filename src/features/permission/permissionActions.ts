import { AppDispatch } from "../../app/store";
import { PermissionService } from "./permissionService";
import { getPermissionsFailure, getPermissionsStart, getPermissionsSuccess } from "./permissionSlice";

export const getPermissions = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(getPermissionsStart());
  
      const response = await PermissionService.getPermissions();
  
      if (response.success) {
        dispatch(getPermissionsSuccess(response.data));
      } else {
        dispatch(getPermissionsFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(getPermissionsFailure('Unknown error'));
    }
  };