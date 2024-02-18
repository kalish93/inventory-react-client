import { AppDispatch } from "../../app/store";
import { CreatePurchase } from "../../models/purchase";
import { PurchaseService } from "./purchaseService";
import { getPurchasesFailure, getPurchasesStart, getPurchasesSuccess, registerPurchaseFailure, registerPurchaseStart, registerPurchaseSuccess } from "./purchaseSlice";

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
      dispatch(registerPurchaseSuccess(response));
    } catch (error) {
      dispatch(registerPurchaseFailure(error));
      throw(error)
    }
  };