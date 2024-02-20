import { AppDispatch } from "../../app/store";
import { CreateCustomer } from "../../models/customer";
import { CustomerService } from "./customerService";
import { getCustomersFailure, getCustomersStart, getCustomersSuccess, registerCustomerFailure, registerCustomerStart, registerCustomerSuccess } from "./customerSlice";

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
      dispatch(registerCustomerSuccess(response));
    } catch (error) {
      dispatch(registerCustomerFailure(error));
    }
  };