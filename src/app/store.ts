import { configureStore } from '@reduxjs/toolkit';
import roleReducer from "../features/role/roleSlice"
import customerReducer from "../features/customer/customerSlice"
import userReducer from "../features/user/userSlice";
import driverReducer from "../features/driver/driverSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    role: roleReducer,
    customer: customerReducer,
    driver: driverReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
