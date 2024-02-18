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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
