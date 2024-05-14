import { AppDispatch } from "../../app/store";
import { CreateCustomer } from "../../models/customer";
import { CustomerService } from "./customerService";
import { deleteCustomerFailure, deleteCustomerStart, deleteCustomerSuccess, getCustomerPaymentsSuccess, getCustomerSalesSuccess, getCustomersFailure, getCustomersStart, getCustomersSuccess, registerCustomerFailure, registerCustomerStart, registerCustomerSuccess, updateCustomerFailure, updateCustomerStart, updateCustomerSuccess } from "./customerSlice";

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

export const updateCustomer = (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(updateCustomerStart());
  
      const response = await CustomerService.updateCustomer(data);
      if (response.success) {
        dispatch(updateCustomerSuccess(response.data));
      } else {
        dispatch(updateCustomerFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(updateCustomerFailure('Unknown error'));
    }
  };

  export const getCustomerPayments = (customerId:any,page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getCustomersStart());
      const response = await CustomerService.getCustomerPayments(customerId,page, pageSize);
      dispatch(getCustomerPaymentsSuccess(response));
    } catch (error) {
      dispatch(getCustomersFailure(error));
    }
  };

  export const getCustomerSales = (customerId:any,page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getCustomersStart());
      const response = await CustomerService.getCustomerSales(customerId,page, pageSize);
      dispatch(getCustomerSalesSuccess(response));
    } catch (error) {
      dispatch(getCustomersFailure(error));
    }
  };