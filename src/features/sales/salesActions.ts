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
  saleStart,
  updatesaleSuccess,
  saleFailure,
  deleteSaleDetailSuccess,
  createSaleDetailSuccess,
} from "./salseSlice";

export const getSales =
  (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
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

export const UpdateSale = (id: any, data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(saleStart());
    const response = await SalesService.updateSale(id,data);
    if (response.success) {
      dispatch(updatesaleSuccess(response.data));
    } else {
      dispatch(saleFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(saleFailure("Unknown error"));
  }
};

export const updateSaleDetail = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(saleStart());
    const response = await SalesService.updateSaleDetail(data);
    if (response.success) {
      dispatch(updatesaleSuccess(response.data));
    } else {
      dispatch(saleFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(saleFailure("Unknown error"));
  }
};
export const deleteSaleDetail = (id: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(saleStart());
    const response = await SalesService.deleteSaleDetail(id);
    if (response.success) {
      dispatch(deleteSaleDetailSuccess(response.data));
    } else {
      dispatch(saleFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(saleFailure("Unknown error"));
  }
};
export const createSaleDetail = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(saleStart());
    const response = await SalesService.createSaleDetail(data);
    if (response.success) {
      dispatch(createSaleDetailSuccess(response.data));
    } else {
      dispatch(saleFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(saleFailure("Unknown error"));
  }
};

export const createCustomerPayment = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(saleStart());
    const response = await SalesService.createCustomerPayment(data);
    if (response.success) {
      dispatch(registerSaleSuccess(response.data));
    } else {
      dispatch(registerSaleFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(saleFailure("Unknown error"));
  }
}