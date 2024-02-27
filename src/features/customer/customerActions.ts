import { AppDispatch } from "../../app/store";
import { CreateCustomer } from "../../models/customer";
import { CustomerService } from "./customerService";
import { deleteCustomerFailure, deleteCustomerStart, deleteCustomerSuccess, getCustomersFailure, getCustomersStart, getCustomersSuccess, registerCustomerFailure, registerCustomerStart, registerCustomerSuccess } from "./customerSlice";

export const getCustomers = (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getCustomersStart());
      const response = await CustomerService.getCustomers(page, pageSize);
      dispatch(getCustomersSuccess(response));
    } catch (error) {
      dispatch(getCustomersFailure(error));
    }
  };

export const createCustomer = (data: CreateCustomer) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerCustomerStart());
  
      const response = await CustomerService.registerCustomer(data);
      if (response.success) {
        dispatch(registerCustomerSuccess(response.data));
      } else {
        dispatch(registerCustomerFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(registerCustomerFailure('Unknown error'));
    }
  };

export const deleteCustomer = (id: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(deleteCustomerStart());
  
      const response = await CustomerService.deleteCustomer(id);
      if (response.success) {
        dispatch(deleteCustomerSuccess(response.data));
      } else {
        dispatch(deleteCustomerFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(deleteCustomerFailure('Unknown error'));
    }
  };