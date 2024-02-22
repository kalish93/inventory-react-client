import { createSlice } from "@reduxjs/toolkit";

interface AccountTypeState {
  accountTypes: any;
  loading: boolean;
  error: any | null;
  isError: boolean
}

const initialState: AccountTypeState = {
  loading: false,
  error: null,
  isError: false,
  accountTypes: []
};

const accountTypeSlice = createSlice({
  name: "accountType",
  initialState,
  reducers: {

    registerAccountTypeStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false
    },
    registerAccountTypeSuccess: (state, action) => {
        const newAccountType = action.payload;
        state.accountTypes = [newAccountType, ...state.accountTypes];
        state.loading = false;
        
    },
    registerAccountTypeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isError = true
    },

    getAccountTypesStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    getAccountTypesSuccess: (state, action) => {
        state.accountTypes = action.payload;
        state.loading = false;
      },
    getAccountTypesFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    },


    registerAccountSubTypeStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false
    },
    registerAccountSubTypeSuccess: (state, action) => {
        const newAccountSubType = action.payload;
        const accountTypeIndex = state.accountTypes.findIndex(
          (accountType: any) => accountType.id === newAccountSubType.accountTypeId
      );
  
      if (accountTypeIndex !== -1) {
          state.accountTypes[accountTypeIndex].accountSubTypes.push(newAccountSubType);
      }
        state.loading = false;
        
    },
    registerAccountSubTypeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isError = true
    },

  },
});

export const {
    registerAccountTypeFailure,
    registerAccountTypeStart,
    registerAccountTypeSuccess,
    getAccountTypesFailure,
    getAccountTypesStart,
    getAccountTypesSuccess,
    registerAccountSubTypeFailure,
    registerAccountSubTypeStart,
    registerAccountSubTypeSuccess
} = accountTypeSlice.actions;

export const selectAccountType = (state: { accountType: AccountTypeState }) => state.accountType;

export default accountTypeSlice.reducer;