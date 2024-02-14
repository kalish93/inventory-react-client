import { AppDispatch } from "../../app/store";
import { CreateSupplier } from "../../models/supplier";
import { SupplierService } from "./supplierService";
import { getSuppliersFailure, getSuppliersStart, getSuppliersSuccess, registerSupplierFailure, registerSupplierStart, registerSupplierSuccess } from "./supplierSlice";

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
      dispatch(registerSupplierSuccess(response));
    } catch (error) {
      dispatch(registerSupplierFailure(error));
    }
  };