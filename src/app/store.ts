// Note: This file is used to create a Redux store and export it for use in the application.
// It also exports the RootState and AppDispatch types for use in other files.
// The store is created using the configureStore function from the Redux Toolkit library,
// which takes an object that maps the reducers to the state keys.
// The reducers are imported from the features folders and combined into a single reducer object using the combineReducers function from the Redux library.
// The store is then exported along with the RootState and AppDispatch types.
import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "../features/role/roleSlice";
import customerReducer from "../features/customer/customerSlice";
import userReducer from "../features/user/userSlice";
import driverReducer from "../features/driver/driverSlice";
import storeReducer from "../features/store/storeSlice";
import supplierReducer from "../features/supplier/supplierSlice";
import productReducer from "../features/product/productSlice";
import declarationReducer from "../features/declaration/declarationSlice";
import purchaseReducer from "../features/purchase/purchaseSlice";
import saleReducer from "../features/sales/salseSlice";
import inventoryReducer from "../features/inventory/inventorySlice";
import accountTypeReducer from "../features/account-type/accountTypeSlice";
import cashOfAccountReducer from "../features/cash-of-account/cashOfAccountSlice";
import transactionSlice from "../features/ca-transaction/transactionSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import permissionReducer from "../features/permission/permissionSlice";
import bankReducer from "../features/bank/bankSlice";
import reportReducer from "../features/report/reportSlice";
import provisionReducer from "../features/provision/provisionSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    role: roleReducer,
    customer: customerReducer,
    driver: driverReducer,
    store: storeReducer,
    supplier: supplierReducer,
    declaration: declarationReducer,
    product: productReducer,
    purchase: purchaseReducer,
    sale: saleReducer,
    inventory: inventoryReducer,
    accountType: accountTypeReducer,
    cashOfAccount: cashOfAccountReducer,
    caTransaction: transactionSlice,
    dashboard: dashboardReducer,
    permission: permissionReducer,
    bank: bankReducer,
    report: reportReducer,
    provision: provisionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
