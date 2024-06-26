import {
  getDriversStart,
  getDriversSuccess,
  getDriversFailure,
  createDriverStart,
  createDriverFailure,
  createDriverSuccess,
  updateDriverFailure,
  updateDriverStart,
  updateDriverSuccess,
  deleteDriverFailure,
  deleteDriverStart,
  deleteDriverSuccess,
  getDriverPaymentsSuccess,
  getDriverTransportsSuccess,
  getDriverSuccess,
} from "./driverSlice";
import { DriverService } from "./driverService";
import { AppDispatch } from "../../app/store";
import { CreateDriver } from "../../models/driver";

export const getDrivers =
  (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getDriversStart());
      const response = await DriverService.getDrivers(page, pageSize);
      dispatch(getDriversSuccess(response));
    } catch (error) {
      dispatch(getDriversFailure(error));
    }
  };

export const createDriver = (driver: CreateDriver) => async (dispatch: AppDispatch) => {
    try {
      dispatch(createDriverStart());
      const response = await DriverService.createDriver(driver);
      if (response.success) {
        dispatch(createDriverSuccess(response.data));
      } else {
        dispatch(createDriverFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(createDriverFailure('Unknown error'));
    }
  };

export const updateDriver =
  (driver: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(updateDriverStart());
      const response = await DriverService.updateDriver(driver);
      if (response.success) {
        dispatch(updateDriverSuccess(response.data));
      } else {
        dispatch(updateDriverFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(updateDriverFailure('Unknown error'));
    }
  };

export const deleteDriver =
  (driverID: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(deleteDriverStart());
      const response = await DriverService.deleteDriver(driverID);
      if (response.success) {
        dispatch(deleteDriverSuccess(response.data));
      } else {
        dispatch(deleteDriverFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(deleteDriverFailure('Unknown error'));
    }
  };

  export const getDriverPayments =
  (id: any, page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getDriversStart());
      const response = await DriverService.getDriverPayments(id, page, pageSize);
      dispatch(getDriverPaymentsSuccess(response));
    } catch (error) {
      dispatch(getDriversFailure(error));
    }
  };

  export const getDriverTransports =
  (id: any, page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getDriversStart());
      const response = await DriverService.getDriverTransports(id, page, pageSize);
      dispatch(getDriverTransportsSuccess(response));
    } catch (error) {
      dispatch(getDriversFailure(error));
    }
  };

  export const getDriver =
  (id: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getDriversStart());
      const response = await DriverService.getDriverById(id);
      dispatch(getDriverSuccess(response));
    } catch (error) {
      dispatch(getDriversFailure(error));
    }
  };