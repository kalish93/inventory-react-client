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
  createJournalEntrySuccessSuccess,
  deleteJournalEntrySuccess,
  getMonthlyTransactionsSuccess,
} from "./transactionSlice";

export const getCATransactions =
  (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
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

export const getTransactionsByMonth =
  (month: number, year: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getTransactionsStart());
      const response = await CATransactionService.getTransactionsByMonth(
        month,
        year
      );
      dispatch(getMonthlyTransactionsSuccess(response));
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

  export const createJournalEntry =
  (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(createTransactionStart());
      const response = await CATransactionService.registerJournalEntry(data);
      if (response.success) {
        dispatch(createJournalEntrySuccessSuccess(response.data));
      } else {
        dispatch(createTransactionFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(createTransactionFailure("Unknown error"));
    }
  };

  export const deleteJournalEntry =
  (id: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(createTransactionStart());
      const response = await CATransactionService.deleteJournalEntry(id);
      if (response.success) {
        dispatch(deleteJournalEntrySuccess(response.data));
      } else {
        dispatch(createTransactionFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(createTransactionFailure("Unknown error"));
    }
  };

  export const createExpensesPayment =
  (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(createTransactionStart());
      const response = await CATransactionService.createExpensesPayment(data);
      if (response.success) {
        dispatch(createTransactionSuccess(response.data));
      } else {
        dispatch(createTransactionFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(createTransactionFailure("Unknown error"));
    }
  };

  export const deleteExpensesPayment =
  (id: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(createTransactionStart());
      const response = await CATransactionService.deleteExpensesPayment(id);
      if (response.success) {
        dispatch(deleteJournalEntrySuccess(response.data));
      } else {
        dispatch(createTransactionFailure(response.error || "Unknown error"));
      }
    } catch (error) {
      dispatch(createTransactionFailure("Unknown error"));
    }
  };