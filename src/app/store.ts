import { configureStore } from '@reduxjs/toolkit';
import roleReducer from "../features/role/roleSlice"
import customerReducer from "../features/customer/customerSlice"
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
import transactionSlice from '../features/ca-transaction/transactionSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
