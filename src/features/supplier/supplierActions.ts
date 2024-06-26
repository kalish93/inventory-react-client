import { AppDispatch } from "../../app/store";
import { CreateSupplier } from "../../models/supplier";
import { SupplierService } from "./supplierService";
import { deleteSupplierFailure, deleteSupplierStart, deleteSupplierSuccess, getSupplierPaymentsSuccess, getSupplierPurchasesSuccess, getSupplierSuccess, getSuppliersFailure, getSuppliersStart, getSuppliersSuccess, registerSupplierFailure, registerSupplierStart, registerSupplierSuccess, updateSupplierFailure, updateSupplierStart, updateSupplierSuccess } from "./supplierSlice";

export const getSuppliers = (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
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

export const updateSupplier = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(updateSupplierStart());
    const response = await SupplierService.updateSupplier(data);
    if (response.success) {
      dispatch(updateSupplierSuccess(response.data));
    } else {
      dispatch(updateSupplierFailure(response.error || 'Unknown error'));
    }
  } catch (error) {
    dispatch(updateSupplierFailure('Unknown error'));
  }
};

export const getSupplierPayments = (id: any, page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(getSuppliersStart());
    const response = await SupplierService.getSupplierPayments(id, page, pageSize);
    dispatch(getSupplierPaymentsSuccess(response));
  } catch (error) {
    dispatch(getSuppliersFailure(error));
  }
};

export const getSupplierPurchases = (id: any, page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(getSuppliersStart());
    const response = await SupplierService.getSupplierPurchases(id, page, pageSize);
    dispatch(getSupplierPurchasesSuccess(response));
  } catch (error) {
    dispatch(getSuppliersFailure(error));
  }
};

export const getSupplier = (id: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(getSuppliersStart());
    const response = await SupplierService.getSupplierById(id);
    dispatch(getSupplierSuccess(response));
  } catch (error) {
    dispatch(getSuppliersFailure(error));
  }
};