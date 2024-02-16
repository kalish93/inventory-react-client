import { AppDispatch } from "../../app/store";
import { CreateProduct } from "../../models/product";
import { ProductService } from "./productService";
import { getProductsFailure, getProductsStart, getProductsSuccess, registerProductFailure, registerProductStart, registerProductSuccess } from "./productSlice";

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
      dispatch(registerProductSuccess(response));
    } catch (error) {
      dispatch(registerProductFailure(error));
    }
  };