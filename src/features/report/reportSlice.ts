import { createSlice } from "@reduxjs/toolkit";

interface ReportState {
  loading: boolean;
  error: any | null;
  isError: boolean;
  successMessage: any;
  customerAgingReport: string | null;
  apAgingReport: string | null;
  bankTransactionReport: string | null;
  transactionListWithSplitsReport: string | null;
  trialBalanceReport: string | null;
  inventoryValuationReport: string | null;
  profitAndLossReport: string| null;
  balanceSheetReport: string| null;
}

const initialState: ReportState = {
  loading: false,
  error: null,
  isError: false,
  successMessage: null,
  customerAgingReport: null,
  apAgingReport: null,
  bankTransactionReport: null,
  transactionListWithSplitsReport: null,
  trialBalanceReport: null,
  inventoryValuationReport: null, 
  profitAndLossReport: null,
  balanceSheetReport: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
   
    generateReportStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      generateCustomerAgingReportSuccess: (state, action) => {
        state.customerAgingReport = action.payload;
        state.loading = false;
      },
      generateApAgingReportSuccess: (state, action) => {
        state.apAgingReport = action.payload;
        state.loading = false;
      },

      generateBankTransactionReportSuccess: (state, action) => {
        state.bankTransactionReport = action.payload;
        state.loading = false;
      },
      generateTransactionListWithSplitsReportSuccess: (state, action) => {
        state.transactionListWithSplitsReport = action.payload;
        state.loading = false;
      },
      generateTrialBalanceReportSuccess: (state, action) => {
        state.trialBalanceReport = action.payload;
        state.loading = false;
      },
      generateInventoryValuationReportSuccess: (state, action) => {
        state.inventoryValuationReport = action.payload;
        state.loading = false;
      },
      generateProfitAndLossReportSuccess: (state, action) => {
        state.profitAndLossReport = action.payload;
        state.loading = false;
      },
      generateBalanceSheetReportSuccess: (state, action) => {
        state.balanceSheetReport = action.payload;
        state.loading = false;
      },
      generateReportFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
  },
});

export const {
    generateCustomerAgingReportSuccess,
    generateReportFailure,
    generateReportStart,
    generateBankTransactionReportSuccess,
    generateTransactionListWithSplitsReportSuccess,
    generateTrialBalanceReportSuccess,
    generateApAgingReportSuccess,
    generateInventoryValuationReportSuccess,
    generateProfitAndLossReportSuccess,
    generateBalanceSheetReportSuccess
  } = reportSlice.actions;
  
export const selectReport = (state: { report: ReportState }) => state.report; 

export default reportSlice.reducer;