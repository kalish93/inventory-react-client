import { AppDispatch } from "../../app/store";
import { CreatePurchase } from "../../models/purchase";
import { createCATransaction } from "../ca-transaction/transactionActions";
import { createTransactionSuccess } from "../ca-transaction/transactionSlice";
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
  createEslCustomCostSuccess,
  createTransitFeeSuccess,
  getWaybillNumberFailure,
  getWaybillNumberSuccess,
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
        dispatch(createTransactionSuccess(response.data));
      } else {
        dispatch(registerPurchaseFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(registerPurchaseFailure("Unknown error"));
    }
  };

  export const deleteTransportCost =
  (id: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerPurchaseStart());
      const response = await PurchaseService.deleteTransportCost(id);
      if (response.success) {
        dispatch(createTransactionSuccess(response.data));
      } else {
        dispatch(registerPurchaseFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(registerPurchaseFailure("Unknown error"));
    }
  };

export const getEslCosts =
  (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getPurchaseCostsStart());
      const response = await PurchaseService.getEslCustomCosts(page, pageSize);
      dispatch(getEslCustomCosts(response));
    } catch (error) {
      dispatch(getPurchaseCostsFailure(error));
    }
  };

export const createEslCost = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(registerPurchaseStart());
    const response = await PurchaseService.createEslCustomCost(data);
    if (response.success) {
      dispatch(createEslCustomCostSuccess(response.data));
    } else {
      dispatch(registerPurchaseFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(registerPurchaseFailure("Unknown error"));
  }
};

export const createESLPayment =
  (eslPaymentData: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerPurchaseStart());
      const response = await PurchaseService.createESLPayment(eslPaymentData);
      if (response.success) {
        dispatch(createTransactionSuccess(response.data));
      } else {
        dispatch(registerPurchaseFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(registerPurchaseFailure("Unknown error"));
    }
  };

export const getTransitFee =
  (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getPurchaseCostsStart());
      const response = await PurchaseService.getTransitFees(page, pageSize);
      dispatch(getTransitFees(response));
    } catch (error) {
      dispatch(getPurchaseCostsFailure(error));
    }
  };

export const createTransitFee =
  (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerPurchaseStart());
      const response = await PurchaseService.createTransitFee(data);
      if (response.success) {
        dispatch(createTransactionSuccess(response.data));
      } else {
        dispatch(registerPurchaseFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(registerPurchaseFailure("Unknown error"));
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

  export const deleteTransitCost =
  (id: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerPurchaseStart());
      const response = await PurchaseService.deleteTransitPayment(id);
      if (response.success) {
        dispatch(createTransactionSuccess(response.data));
      } else {
        dispatch(registerPurchaseFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(registerPurchaseFailure("Unknown error"));
    }
  };

  export const deleteEslCost =
  (id: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerPurchaseStart());
      const response = await PurchaseService.deleteEslPayment(id);
      if (response.success) {
        dispatch(createTransactionSuccess(response.data));
      } else {
        dispatch(registerPurchaseFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(registerPurchaseFailure("Unknown error"));
    }
  };

  export const getWaybillNumber = () => async (dispatch: AppDispatch) => {
    try {
      const response = await PurchaseService.getWaybillNumber();
      if (response) {
        dispatch(getWaybillNumberSuccess(response));
      } else {
        dispatch(getWaybillNumberFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(getWaybillNumberFailure("Unknown error"));
    }
  }