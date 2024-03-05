import {
  changePasswordFailure,
  changePasswordStart,
  changePasswordSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  getUsersFailure,
  getUsersStart,
  getUsersSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  logoutUser,
  registerUserFailure,
  registerUserStart,
  registerUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "./userSlice";
import { UserService } from "./userService";
import { AppDispatch } from "../../app/store";
import { CreateUser } from "../../models/user";

export const login =
  (username: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(loginStart());
      const response = await UserService.login(username, password);
      dispatch(loginSuccess(response));
    } catch (error: any) {
      dispatch(
        loginFailure(
          error.response ? error.response.data.error : "Unknown error"
        )
      );
      throw error;
    }
  };

export const signUpUser =
  (userData: CreateUser) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerUserStart());

      const response = await UserService.registerUser(userData);

      if (response.success) {
        dispatch(registerUserSuccess(response.data));
      } else {
        dispatch(registerUserFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(registerUserFailure("Unknown error"));
    }
  };

export const getUsers =
  (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getUsersStart());
      const response = await UserService.getUsers(page, pageSize);
      dispatch(getUsersSuccess(response));
    } catch (error) {
      dispatch(getUsersFailure(error));
    }
  };

export const logout = () => (dispatch: AppDispatch) => {
  UserService.logout();
  dispatch(logoutUser());
};

export const updateUser = (userData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(updateUserStart());

    const response = await UserService.updateUser(userData);

    if (response.success) {
      dispatch(updateUserSuccess(response.data));
    } else {
      dispatch(updateUserFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(updateUserFailure("Unknown error"));
  }
};

export const deleteUser = (id: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(deleteUserStart());

    const response = await UserService.deleteUser(id);

    if (response.success) {
      dispatch(deleteUserSuccess(response.data));
    } else {
      dispatch(deleteUserFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(deleteUserFailure("Unknown error"));
  }
};

export const changePassword = (passwordData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(changePasswordStart());

    const response = await UserService.changePassword(passwordData);

    if (response.success) {
      dispatch(changePasswordSuccess(response.data));
    } else {
      dispatch(changePasswordFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(changePasswordFailure("Unknown error"));
  }
};