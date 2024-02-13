import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../features/user/userSlice"
import roleReducer from "../features/role/roleSlice"
import customerReducer from "../features/customer/customerSlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    role: roleReducer,
    customer: customerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
