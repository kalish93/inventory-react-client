import {
  bankFailure,
  bankStart,
  createBankSuccess,
  deleteBankSuccess,
  getBankSuccess,
  getBankByIdSuccess,
  updateBankSuccess,
  getBankTransactionsSuccess,
} from "./bankSlice";
import { AppDispatch } from "../../app/store";
import { bankService } from "./bankServices";
import { Bank } from "../../models/bank";

export const getBanks =
  (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(bankStart());
      const response = await bankService.getBanks(page, pageSize);
      dispatch(getBankSuccess(response));
    } catch (error) {
      dispatch(bankFailure(error));
    }
  };

export const getBank = (id: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(bankStart());
    const response = await bankService.getBank(id);
    dispatch(getBankByIdSuccess(response));
  } catch (error) {
    dispatch(bankFailure(error));
  }
};

export const createBank = (bankData: Bank) => async (dispatch: AppDispatch) => {
  try {
    dispatch(bankStart());
    const response = await bankService.createBank(bankData);
    if (response.success) {
      dispatch(createBankSuccess(response.data));
    } else {
      dispatch(bankFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(bankFailure("Unknown error"));
  }
};

export const createBankTransaction =
  (bankData: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(bankStart());
      const response = await bankService.createBankTransaction(bankData);
      if (response.success) {
        dispatch(createBankSuccess(response.data));
      } else {
        dispatch(bankFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(bankFailure("Unknown error"));
    }
  };

export const updateBank = (bankData: Bank) => async (dispatch: AppDispatch) => {
  try {
    dispatch(bankStart());
    const response = await bankService.updateBank(bankData);
    if (response.success) {
      dispatch(updateBankSuccess(response.data));
    } else {
      dispatch(bankFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(bankFailure("Unknown error"));
  }
};

export const deleteBank = (bankId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(bankStart());
    const response = await bankService.deleteBank(bankId);
    if (response.success) {
      dispatch(deleteBankSuccess(response.data));
    } else {
      dispatch(bankFailure(response.error || "Unknown error"));
    }
  } catch (error) {
    dispatch(bankFailure("Unknown error"));
  }
};

export const getBankTransactions =
  (id: any, page: number, pageSize: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(bankStart());
      const response = await bankService.getBankTransactions(id, page, pageSize);
      dispatch(getBankTransactionsSuccess(response));
    } catch (error) {
      dispatch(bankFailure(error));
    }
  };