import { AppDispatch } from "../../app/store";
import { ReportService } from "./reportService";
import { generateApAgingReportSuccess, generateBankTransactionReportSuccess, generateCustomerAgingReportSuccess, generateReportFailure, generateReportStart, generateTransactionListWithSplitsReportSuccess, generateTrialBalanceReportSuccess, generateInventoryValuationReportSuccess, generateProfitAndLossReportSuccess, generateBalanceSheetReportSuccess } from "./reportSlice";


export const generateCustomerAgingReport =
(endDate?: any) =>
async (dispatch: AppDispatch) => {
  try {
    dispatch(generateReportStart()); // Dispatch the action to indicate the start of report generation
    const response = await ReportService.getCustomerAgingReport(endDate); // Call the service method to generate the report
    dispatch(generateCustomerAgingReportSuccess(response.data)); // Dispatch the success action with the report URL
  } catch (error) {
    dispatch(generateReportFailure(error)); // Dispatch the failure action if an error occurs
  }
};

export const generateBankTransactionReport =
(selectedBank: any,startDate?: Date, endDate?: Date,) =>
async (dispatch: AppDispatch) => {
  try {
    dispatch(generateReportStart()); // Dispatch the action to indicate the start of report generation
    const response = await ReportService.getBankTransactionReport(selectedBank,startDate, endDate); // Call the service method to generate the report
    dispatch(generateBankTransactionReportSuccess(response.data)); // Dispatch the success action with the report URL
  } catch (error) {
    dispatch(generateReportFailure(error)); // Dispatch the failure action if an error occurs
  }
};

export const generateApAgingReport =
(endDate?: any) =>
async (dispatch: AppDispatch) => {
  try {
    dispatch(generateReportStart()); // Dispatch the action to indicate the start of report generation
    const response = await ReportService.getApAgingReport(endDate); // Call the service method to generate the report
    dispatch(generateApAgingReportSuccess(response.data)); // Dispatch the success action with the report URL
  } catch (error) {
    dispatch(generateReportFailure(error)); // Dispatch the failure action if an error occurs
  }
};

export const generateTransactionListWithSplits =
(startDate?: Date, endDate?:Date) =>
async (dispatch: AppDispatch) => {
  try {
    dispatch(generateReportStart()); // Dispatch the action to indicate the start of report generation
    const response = await ReportService.getTransactionListWithSplitsReport(startDate, endDate); // Call the service method to generate the report
    dispatch(generateTransactionListWithSplitsReportSuccess(response.data)); // Dispatch the success action with the report URL
  } catch (error) {
    dispatch(generateReportFailure(error)); // Dispatch the failure action if an error occurs
  }
};
export const generateTrialBalance =
(startDate?: Date, endDate?:Date) =>
async (dispatch: AppDispatch) => {
  try {
    dispatch(generateReportStart()); // Dispatch the action to indicate the start of report generation
    const response = await ReportService.getTrialBalanceReport(startDate, endDate); // Call the service method to generate the report
    dispatch(generateTrialBalanceReportSuccess(response.data)); // Dispatch the success action with the report URL
  } catch (error) {
    dispatch(generateReportFailure(error)); // Dispatch the failure action if an error occurs
  }
};

export const generateInventoryValuationReport =
(endDate?:Date) =>
async (dispatch: AppDispatch) => {
  try {
    dispatch(generateReportStart()); // Dispatch the action to indicate the start of report generation
    const response = await ReportService.getInventoryValuationReport( endDate); // Call the service method to generate the report
    dispatch(generateInventoryValuationReportSuccess(response.data)); // Dispatch the success action with the report URL
  } catch (error) {
    dispatch(generateReportFailure(error)); // Dispatch the failure action if an error occurs
  }
};

export const generateProfitAndLoss =
(startDate?: Date, endDate?:Date) =>
async (dispatch: AppDispatch) => {
  try {
    dispatch(generateReportStart()); // Dispatch the action to indicate the start of report generation
    const response = await ReportService.getProfitAndLossReport(startDate, endDate); // Call the service method to generate the report
    dispatch(generateProfitAndLossReportSuccess(response.data)); // Dispatch the success action with the report URL
  } catch (error) {
    dispatch(generateReportFailure(error)); // Dispatch the failure action if an error occurs
  }
};
export const generateBalanceSheet =
(endDate?:Date) =>
async (dispatch: AppDispatch) => {
  try {
    dispatch(generateReportStart()); // Dispatch the action to indicate the start of report generation
    const response = await ReportService.getBalanceSheetReport(endDate); // Call the service method to generate the report
    dispatch(generateBalanceSheetReportSuccess(response.data)); // Dispatch the success action with the report URL
  } catch (error) {
    dispatch(generateReportFailure(error)); // Dispatch the failure action if an error occurs
  }
};