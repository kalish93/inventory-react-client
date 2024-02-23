import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../models/user";
import { PaginatedList } from "../../models/commons/paginatedList";

interface UserState {
  user: null | any;
  accessToken: null | string;
  users: PaginatedList<User>;
  loading: boolean;
  error: any | null;
  isError: boolean
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  accessToken: null,
  users: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1
  },
  loading: false,
  error: null,
  isError: false,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ username: string; accessToken: string }>
    ) => {
      state.user = action.payload;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = !!action.payload.accessToken;
      state.loading = false;
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isError = true
    },

    registerUserStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false
    },
    registerUserSuccess: (state, action) => {
        const newUser = action.payload;
        state.users = {
            items: [newUser, ...(state.users?.items || [])],
            totalCount: (state.users?.totalCount || 0) + 1,
            pageSize: state.users?.pageSize || 10, 
            currentPage: state.users?.currentPage || 1, 
            totalPages: state.users?.totalPages || 1, 
        };

        state.loading = false;
        
    },
    registerUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isError = true
    },

    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },

    getUsersStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    getUsersSuccess: (state, action) => {
        state.users = action.payload;
        state.loading = false;
      },
    getUsersFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
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
  getUsersStart,
  getUsersSuccess,
  getUsersFailure
} = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user;

export default userSlice.reducer;
