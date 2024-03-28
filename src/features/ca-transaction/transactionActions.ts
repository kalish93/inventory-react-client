import { AppDispatch } from "../../app/store";
import { CATransactionService } from "./transactionService";
import {
  getTransactionsFailure,
  getTransactionsStart,
  getTransactionsSuccess,
  createTransactionFailure,
  createTransactionStart,
  createTransactionSuccess,
  createTransitPaymentSuccess,
  getTransitPaymentsSuccess,
} from "./transactionSlice";

export const getCATransactions =
  (page: number, pageSize: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getTransactionsStart());
      const response = await CATransactionService.getCATransactions(
        page,
        pageSize
      );
      dispatch(getTransactionsSuccess(response));
    } catch (error) {
      dispatch(getTransactionsFailure(error));
    }
  };

export const createCATransaction =
  (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(createTransactionStart());
      const response = await CATransactionService.registerCATransactions(data);
      if (response.success) {
        dispatch(createTransactionSuccess(response.data));
      } else {
        dispatch(createTransactionFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(createTransactionFailure("Unknown error"));
    }
  };

export const createTransitPayment =
  (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(createTransactionStart());
      const response = await CATransactionService.createTransitPayments(data);
      if (response.success) {
        dispatch(createTransitPaymentSuccess(response.data));
      } else {
        dispatch(createTransactionFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(createTransactionFailure("Unknown error"));
    }
  };

export const getTransitPayments =
  (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getTransactionsStart());
      const response = await CATransactionService.getTransitPayments(
        page,
        pageSize
      );
      dispatch(getTransitPaymentsSuccess(response));
    } catch (error) {
      dispatch(getTransactionsFailure(error));
    }
  };
