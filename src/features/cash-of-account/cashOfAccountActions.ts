import { AppDispatch } from "../../app/store";
import { CashOfAccountService } from "./cashOfAccountService";
import {
  getCashOfAccountsFailure,
  getCashOfAccountsStart,
  getCashOfAccountsSuccess,
  registerCashOfAccountFailure,
  registerCashOfAccountStart,
  registerCashOfAccountSuccess,
  getBanksSuccess,
  getExpensesSuccess,
} from "./cashOfAccountSlice";

export const getCashOfAccounts =
  (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getCashOfAccountsStart());
      const response = await CashOfAccountService.getCAs(page, pageSize);
      dispatch(getCashOfAccountsSuccess(response));
    } catch (error) {
      dispatch(getCashOfAccountsFailure(error));
    }
  };

export const getCashOfAccountBanks = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(getCashOfAccountsStart());
    const response = await CashOfAccountService.getCABanks();
    dispatch(getBanksSuccess(response));
  } catch (error) {
    dispatch(getCashOfAccountsFailure(error));
  }
};

export const getCashOfAccountExpenses = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(getCashOfAccountsStart());
    const response = await CashOfAccountService.getCAExpenses();
    dispatch(getExpensesSuccess(response));
  } catch (error) {
    dispatch(getCashOfAccountsFailure(error));
  }
};

export const createCashOfAccount =
  (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerCashOfAccountStart());

      const response = await CashOfAccountService.creataCA(data);

      if (response.success) {
        dispatch(registerCashOfAccountSuccess(response.data));
      } else {
        dispatch(
          registerCashOfAccountFailure(response.error || "Unknown error")
        );
      }
    } catch (error) {
      dispatch(registerCashOfAccountFailure("Unknown error"));
    }
  };


