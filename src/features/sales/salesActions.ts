import { AppDispatch } from "../../app/store";
import { CreateSales } from "../../models/sales";
import { SalesService } from "./salesService";
import {
  getSaleByIdFailure,
  getSaleByIdStart,
  getSaleByIdSuccess,
  getSalesFailure,
  getSalesStart,
  getSalesSuccess,
  registerSaleFailure,
  registerSaleStart,
  deleteSaleSuccess,
  registerSaleSuccess,
} from "./salseSlice";

export const getSales =
  (page: number, pageSize: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getSalesStart());
      const response = await SalesService.getSales(page, pageSize);
      dispatch(getSalesSuccess(response));
    } catch (error) {
      dispatch(getSalesFailure(error));
    }
  };

export const createSale = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(registerSaleStart());
    const response = await SalesService.registerSale(data);
    if (response.success) {
      dispatch(registerSaleSuccess(response.data));
    } else {
      dispatch(registerSaleFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(registerSaleFailure("Unknown error"));
  }
};

export const getSale = (id: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(getSaleByIdStart());
    const response = await SalesService.getSaleById(id);
    dispatch(getSaleByIdSuccess(response));
  } catch (error) {
    dispatch(getSaleByIdFailure(error));
    throw error;
  }
};

export const deleteSale = (id: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(getSaleByIdStart());
    const response = await SalesService.deleteSale(id);
    dispatch(deleteSaleSuccess(response.data));
  } catch (error) {
    dispatch(registerSaleFailure(error));
  }
};
