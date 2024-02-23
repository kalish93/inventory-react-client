import { AppDispatch } from "../../app/store";
import { CreatePurchase } from "../../models/purchase";
import { PurchaseService } from "./purchaseService";
import { getPurchaseByIdFailure, getPurchaseByIdStart, getPurchaseByIdSuccess, getPurchasesFailure, getPurchasesStart, getPurchasesSuccess, registerPurchaseFailure, registerPurchaseStart, registerPurchaseSuccess } from "./purchaseSlice";

export const getPurchases = (page: number, pageSize: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getPurchasesStart()); 
      const response = await PurchaseService.getPurchases(page, pageSize);
      dispatch(getPurchasesSuccess(response));
    } catch (error) {
      dispatch(getPurchasesFailure(error));
    }
  };

export const createPurchase = (data: CreatePurchase) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerPurchaseStart());
      const response = await PurchaseService.registerPurchase(data);
      if (response.success) {
        dispatch(registerPurchaseSuccess(response.data));
      } else {
        dispatch(registerPurchaseFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(registerPurchaseFailure('Unknown error'));
    }
  };

  export const getPurchase = (id:any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getPurchaseByIdStart());
      const response = await PurchaseService.getPurchaseById(id);
      dispatch(getPurchaseByIdSuccess(response));
    } catch (error) {
      dispatch(getPurchaseByIdFailure(error));
      throw(error)
    }
  };