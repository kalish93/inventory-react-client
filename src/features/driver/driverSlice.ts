import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Driver } from "../../models/driver";
import { PaginatedList } from "../../models/commons/paginatedList";

interface DriverState {
  drivers: PaginatedList<Driver>;
  driverPayments: PaginatedList<any>;
  driverTransports: PaginatedList<any>;
  loading: boolean;
  error: any | null;
  isError: boolean;
  successMessage: any;
  driver: any;
}

const initialState: DriverState = {
  drivers: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  driverPayments: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  driverTransports: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1,
  },
  loading: false,
  error: null,
  isError:false,
  successMessage: null,
  driver: null
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    getDriversStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDriversSuccess: (
      state,
      action: PayloadAction<PaginatedList<Driver>>
    ) => {
      state.drivers = action.payload;
      state.loading = false;
    },
    getDriversFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createDriverStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
      state.successMessage = null;
    },
    createDriverSuccess: (state, action) => {
      const newDriver = action.payload;
      state.drivers = {
        items: [newDriver, ...(state.drivers?.items || [])],
        totalCount: (state.drivers?.totalCount || 0) + 1,
        pageSize: state.drivers?.pageSize || 10,
        currentPage: state.drivers?.currentPage || 1,
        totalPages: state.drivers?.totalPages || 1,
      };
      state.loading = false;
      state.successMessage = "Driver Created Successfully.";
    },
    createDriverFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.isError = true;
    },

    deleteDriverStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteDriverSuccess: (state, action) => {
      const driverToDelete = action.payload;
      state.drivers = {
        items:
          state.drivers?.items?.filter(
            (driver) => driver.id !== driverToDelete.id
          ) ?? [],
        totalCount: (state.drivers?.totalCount || 0) - 1,
        pageSize: state.drivers?.pageSize || 10,
        currentPage: state.drivers?.currentPage || 1,
        totalPages: state.drivers?.totalPages || 1,
      };
      state.loading = false;
    },
    deleteDriverFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateDriverStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isError = false;
      state.successMessage = null;
    },

    updateDriverSuccess: (state, action) => {
      const updatedDriver = action.payload;
      state.drivers = {
        items:
          state.drivers?.items?.map((driver) =>
            driver.id === updatedDriver.id ? updatedDriver : driver
          ) ?? [],
        totalCount: state.drivers?.totalCount || 0,
        pageSize: state.drivers?.pageSize || 10,
        currentPage: state.drivers?.currentPage || 1,
        totalPages: state.drivers?.totalPages || 1,
      };
      state.loading = false;
      state.successMessage = "Driver Updated Successfully.";
    },

    updateDriverFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.isError = true;
      state.error = action.payload;
    },

    getDriverPaymentsSuccess: (state, action: PayloadAction<any>) => {
      state.driverPayments = action.payload;
      state.loading = false;
    },

    getDriverTransportsSuccess: (state, action: PayloadAction<any>) => {
      state.driverTransports = action.payload;
      state.loading = false;
    },

    getDriverSuccess: (state, action: PayloadAction<any>) => {
      state.driver = action.payload;
      state.loading = false;
    },
  },
});

export const {
  getDriversStart,
  getDriversSuccess,
  getDriversFailure,
  createDriverFailure,
  createDriverStart,
  createDriverSuccess,
  deleteDriverStart,
  deleteDriverSuccess,
  deleteDriverFailure,
  updateDriverStart,
  updateDriverSuccess,
  updateDriverFailure,
  getDriverPaymentsSuccess,
  getDriverTransportsSuccess,
  getDriverSuccess
} = driverSlice.actions;

export const selectDrivers = (state: {driver: DriverState}) => state.driver;

export default driverSlice.reducer;
