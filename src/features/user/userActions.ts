import { loginFailure, loginStart, loginSuccess, logoutUser, registerUserFailure, registerUserStart, registerUserSuccess } from './userSlice';
import { UserService } from './userService';
import { AppDispatch } from '../../app/store';
import { CreateUser } from '../../models/user';

export const login = (username: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loginStart());
    const response = await UserService.login(username, password);
    dispatch(loginSuccess(response));
  } catch (error) {
    dispatch(loginFailure(error));
  }
};

export const signUpUser = (userData: CreateUser) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerUserStart());
      const response = await registerUser(userData);
      dispatch(registerUserSuccess(response));
    } catch (error) {
      dispatch(registerUserFailure(error));
    }
  };

export const logout = () => (dispatch: AppDispatch) => {
  UserService.logout();
  dispatch(logoutUser());
};
function registerUser(userData: CreateUser) {
    throw new Error('Function not implemented.');
}

