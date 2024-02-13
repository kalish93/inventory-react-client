import { AppDispatch } from "../../app/store";
import { RoleService } from "./roleService";
import { getRolesFailure, getRolesStart, getRolesSuccess } from "./roleSlice";

export const getRoles = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(getRolesStart());
      const response = await RoleService.getRoles();
      dispatch(getRolesSuccess(response));
    } catch (error) {
      dispatch(getRolesFailure(error));
    }
  };