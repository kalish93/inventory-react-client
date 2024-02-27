import { AppDispatch } from "../../app/store";
import { CreateCATransaction } from "../../models/ca-transaction";
import { CATransactionService } from "./transactionService";
import {
  getTransactionsFailure,
  getTransactionsStart,
  getTransactionsSuccess,
  createTransactionFailure,
  createTransactionStart,
  createTransactionSuccess,
} from "./transactionSlice";


export const getCATransactions = (page: number, pageSize: number) => async (dispatch: AppDispatch) => {
    try {
        dispatch(getTransactionsStart());
        const response = await CATransactionService.getCATransactions(page, pageSize);
        dispatch(getTransactionsSuccess(response));
    } catch (error) {
        dispatch(getTransactionsFailure(error));
    }
    };

export const createCATransaction = (data: any) => async (dispatch: AppDispatch) => {
    try {
        dispatch(createTransactionStart());
        const response = await CATransactionService.registerCATransactions(data);
        if (response.success) {
            dispatch(createTransactionSuccess(response.data));
        } else {
            dispatch(createTransactionFailure(response.error || 'Unknown error'));
        }
    } catch (error) {
        dispatch(createTransactionFailure('Unknown error'));
    }
}