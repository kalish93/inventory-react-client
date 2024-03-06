import { AppDispatch } from "../../app/store";
import { DashboardService } from "./dashboardService";
import { dashboardFailure, dashboardStart, getBankExpensesSuccess, getExpensesSuccess } from "./dashboardSlice";

export const getExpenses = (startDate?: any, endDate?: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(dashboardStart());
  
      const response = await DashboardService.getExpenses(startDate, endDate);
      if (response.success) {
        dispatch(getExpensesSuccess(response.data));
      } else {
        dispatch(dashboardFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(dashboardFailure('Unknown error'));
    }
  };

export const getBankPositions = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(dashboardStart());
  
      const response = await DashboardService.getBankPositions();
      if (response.success) {
        dispatch(getBankExpensesSuccess(response.data));
      } else {
        dispatch(dashboardFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(dashboardFailure('Unknown error'));
    }
  };