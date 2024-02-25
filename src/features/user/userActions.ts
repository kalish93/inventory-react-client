import { getUsersFailure, getUsersStart, getUsersSuccess, loginFailure, loginStart, loginSuccess, logoutUser, registerUserFailure, registerUserStart, registerUserSuccess } from './userSlice';
import { UserService } from './userService';
import { AppDispatch } from '../../app/store';
import { CreateUser } from '../../models/user';

export const login = (username: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loginStart());
    const response = await UserService.login(username, password);
    dispatch(loginSuccess(response));
  } catch (error: any) {
    dispatch(loginFailure(error.response ? error.response.data.error : 'Unknown error'));
    throw error;
  }
};

export const signUpUser = (userData: CreateUser) => async (dispatch: AppDispatch) => {
  try {
    dispatch(registerUserStart());

    const response = await UserService.registerUser(userData);

    if (response.success) {
      dispatch(registerUserSuccess(response.data));
    } else {
      dispatch(registerUserFailure(response.error || 'Unknown error'));
    }
  } catch (error) {
    dispatch(registerUserFailure('Unknown error'));
  }
};

export const getUsers = (page: number, pageSize: number) => async (dispatch: AppDispatch) => {
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


