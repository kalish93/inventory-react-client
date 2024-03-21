import { AppDispatch } from "../../app/store";
import { CreatePurchase } from "../../models/purchase";
import { PurchaseService } from "./purchaseService";
import {
  getPurchaseByIdFailure,
  getPurchaseByIdStart,
  getPurchaseByIdSuccess,
  getPurchasesFailure,
  getPurchasesStart,
  getPurchasesSuccess,
  registerPurchaseFailure,
  registerPurchaseStart,
  registerPurchaseSuccess,
  deletePurchaseSuccess,
  getPurchaseCostsStart,
  getPurchaseCostsFailure,
  getTransportCosts,
  getEslCustomCosts,
  getTransitFees,
  updatePurchaseSuccess,
  registerTransportCostSuccess,
} from "./purchaseSlice";

export const getPurchases =
  (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getPurchasesStart());
      const response = await PurchaseService.getPurchases(page, pageSize);
      dispatch(getPurchasesSuccess(response));
    } catch (error) {
      dispatch(getPurchasesFailure(error));
    }
  };

export const createPurchase = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(registerPurchaseStart());
    const response = await PurchaseService.registerPurchase(data);
    if (response.success) {
      dispatch(registerPurchaseSuccess(response.data));
    } else {
      dispatch(registerPurchaseFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(registerPurchaseFailure("Unknown error"));
  }
};

export const getPurchase = (id: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(getPurchaseByIdStart());
    const response = await PurchaseService.getPurchaseById(id);
    dispatch(getPurchaseByIdSuccess(response));
  } catch (error) {
    dispatch(getPurchaseByIdFailure(error));
    throw error;
  }
};

export const deletePurchase = (id: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(registerPurchaseStart());
    const response = await PurchaseService.deletePurchase(id);
    if (response.success) {
      dispatch(deletePurchaseSuccess(response.data));
    } else {
      dispatch(registerPurchaseFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(registerPurchaseFailure("Unknown error"));
  }
};

export const updatePurchase =
  (id: any, data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerPurchaseStart());
      const response = await PurchaseService.updatePurchase(id, data);
      if (response.success) {
        dispatch(updatePurchaseSuccess(response.data));
      } else {
        dispatch(registerPurchaseFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(registerPurchaseFailure("Unknown error"));
    }
  };

export const getTransportCost =
  (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getPurchaseCostsStart());
      const response = await PurchaseService.getTransportcosts(page, pageSize);
      dispatch(getTransportCosts(response));
    } catch (error) {
      dispatch(getPurchaseCostsFailure(error));
    }
  };
export const createTransportCost =
  (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerPurchaseStart());
      const response = await PurchaseService.createTransportCost(data);
      if (response.success) {
        dispatch(registerTransportCostSuccess(response.data));
      } else {
        dispatch(registerPurchaseFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(registerPurchaseFailure("Unknown error"));
    }
  };

export const getEslCosts =
  (page: number, pageSize: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getPurchaseCostsStart());
      const response = await PurchaseService.getEslCustomCosts(page, pageSize);
      dispatch(getEslCustomCosts(response));
    } catch (error) {
      dispatch(getPurchaseCostsFailure(error));
    }
  };
export const getTransitFee =
  (page: number, pageSize: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getPurchaseCostsStart());
      const response = await PurchaseService.getTransitFees(page, pageSize);
      dispatch(getTransitFees(response));
    } catch (error) {
      dispatch(getPurchaseCostsFailure(error));
    }
  };

export const createSupplierPayment =
  (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerPurchaseStart());
      const response = await PurchaseService.createSupplierPayment(data);
      if (response.success) {
        dispatch(registerPurchaseSuccess(response.data));
      } else {
        dispatch(registerPurchaseFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(registerPurchaseFailure("Unknown error"));
    }
  };
