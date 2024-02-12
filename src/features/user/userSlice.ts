import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../models/user";

interface UserState {
  user: null | { username: string; token: string };
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ username: string; token: string }>
    ) => {
      state.user = action.payload;
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    registerUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerUserSuccess: (state, action) => {
      state.loading = false;
      state.users = [...state.users, action.payload];
    },
    registerUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutUser,
  registerUserStart,
  registerUserSuccess,
  registerUserFailure,
} = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.user;

export default userSlice.reducer;
