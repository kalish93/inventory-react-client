import { AppDispatch } from "../../app/store";
import { CreateProduct } from "../../models/product";
import { ProductService } from "./productService";
import { deleteProductStart, deleteProductSuccess, deleteproductFailure, getProductsFailure, getProductsStart, getProductsSuccess, registerProductFailure, registerProductStart, registerProductSuccess } from "./productSlice";

export const getProducts = (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getProductsStart());
      const response = await ProductService.getProducts(page, pageSize);
      dispatch(getProductsSuccess(response));
    } catch (error) {
      dispatch(getProductsFailure(error));
    }
  };

export const createProduct = (data: CreateProduct) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerProductStart());
      const response = await ProductService.registerProduct(data);
      if (response.success) {
        dispatch(registerProductSuccess(response.data));
      } else {
        dispatch(registerProductFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(registerProductFailure('Unknown error'));
    }
  };

  export const deleteProduct =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(deleteProductStart());
      const response = await ProductService.deleteProduct(id);
      if (response.success) {
        dispatch(deleteProductSuccess(response.data));
      } else {
        dispatch(deleteproductFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(deleteproductFailure('Unknown error'));
    }
  };