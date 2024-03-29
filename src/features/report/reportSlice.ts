import { createSlice } from "@reduxjs/toolkit";

interface ReportState {
  loading: boolean;
  error: any | null;
  isError: boolean;
  successMessage: any;
  customerAgingReport: string | null;
  bankTransactionReport: string | null;
}

const initialState: ReportState = {
  loading: false,
  error: null,
  isError: false,
  successMessage: null,
  customerAgingReport: null,
  bankTransactionReport: null,
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

      generateBankTransactionReportSuccess: (state, action) => {
        state.bankTransactionReport = action.payload;
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
    generateBankTransactionReportSuccess
  } = reportSlice.actions;
  
export const selectReport = (state: { report: ReportState }) => state.report; 

export default reportSlice.reducer;