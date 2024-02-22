import { AppDispatch } from "../../app/store";
import { CreateAccountSubType, CreateAccountType } from "../../models/account-type";
import { getAccountTypesFailure, getAccountTypesStart, getAccountTypesSuccess, registerAccountSubTypeFailure, registerAccountSubTypeStart, registerAccountSubTypeSuccess, registerAccountTypeFailure, registerAccountTypeStart, registerAccountTypeSuccess } from "./accountTypeSlice";
import { AccountTypeService } from "./accountTypeService";

export const createAccountType = (data: CreateAccountType) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerAccountTypeStart());
  
      const response = await AccountTypeService.createAccountType(data);
  
      if (response.success) {
        dispatch(registerAccountTypeSuccess(response.data));
      } else {
        dispatch(registerAccountTypeFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(registerAccountTypeFailure('Unknown error'));
    }
  };

export const getAccountTypes = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(getAccountTypesStart());
      const response = await AccountTypeService.getAccountTypes();
      dispatch(getAccountTypesSuccess(response));
    } catch (error) {
      dispatch(getAccountTypesFailure(error));
    }
  };

  export const createAccountSubType = (data: CreateAccountSubType) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerAccountSubTypeStart());
  
      const response = await AccountTypeService.createAccountSubType(data);
  
      if (response.success) {
        dispatch(registerAccountSubTypeSuccess(response.data));
      } else {
        dispatch(registerAccountSubTypeFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(registerAccountSubTypeFailure('Unknown error'));
    }
  };