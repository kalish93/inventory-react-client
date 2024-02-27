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
  (driver: CreateDriver) => async (dispatch: AppDispatch) => {
    try {
      dispatch(updateDriverStart());
      const response = await DriverService.updateDriver(driver);
      dispatch(updateDriverSuccess(response));
    } catch (error) {
      dispatch(updateDriverFailure(error));
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
