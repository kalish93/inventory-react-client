import { AppDispatch } from "../../app/store";
import { CreateSupplier } from "../../models/supplier";
import { SupplierService } from "./supplierService";
import { deleteSupplierFailure, deleteSupplierStart, deleteSupplierSuccess, getSuppliersFailure, getSuppliersStart, getSuppliersSuccess, registerSupplierFailure, registerSupplierStart, registerSupplierSuccess } from "./supplierSlice";

export const getSuppliers = (page: number, pageSize: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getSuppliersStart());
      const response = await SupplierService.getSuppliers(page, pageSize);
      dispatch(getSuppliersSuccess(response));
    } catch (error) {
      dispatch(getSuppliersFailure(error));
    }
  };

export const createSupplier = (data: CreateSupplier) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerSupplierStart());
      const response = await SupplierService.registerSupplier(data);
      if (response.success) {
        dispatch(registerSupplierSuccess(response.data));
      } else {
        dispatch(registerSupplierFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(registerSupplierFailure('Unknown error'));
    }
  };

export const deleteSupplier = (id: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(deleteSupplierStart());
      const response = await SupplierService.deleteSupplier(id);
      if (response.success) {
        dispatch(deleteSupplierSuccess(response.data));
      } else {
        dispatch(deleteSupplierFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(deleteSupplierFailure('Unknown error'));
    }
};