import { AppDispatch } from "../../app/store";
import { ProductService } from "./productService";
import { createProductCategorySuccess, createUnitOfMeasurementSuccess, deleteProductCategorySuccess, deleteProductStart, deleteProductSuccess, deleteUnitOfMeasurementSuccess, deleteproductFailure, getProductCategoriesSuccess, getProductsFailure, getProductsStart, getProductsSuccess, getUnitOfMeasurementsSuccess, productCategoriesFailure, productCategoriesStart, registerProductFailure, registerProductStart, registerProductSuccess, unitOfMeasurementsFailure, unitOfMeasurementsStart, updateProductCategorySuccess, updateProductStart, updateProductSuccess, updateUnitOfMeasurementSuccess, updateproductFailure } from "./productSlice";

export const getProducts = (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getProductsStart());
      const response = await ProductService.getProducts(page, pageSize);
      dispatch(getProductsSuccess(response));
    } catch (error) {
      dispatch(getProductsFailure(error));
    }
  };

export const createProduct = (data: any) => async (dispatch: AppDispatch) => {
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

  export const updateProduct = (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(updateProductStart());
      const response = await ProductService.updateProduct(data);
      if (response.success) {
        dispatch(updateProductSuccess(response.data));
      } else {
        dispatch(updateproductFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(updateproductFailure('Unknown error'));
    }
  };


  export const getProductCategories = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(productCategoriesStart());
      const response = await ProductService.getProductCategories();
      dispatch(getProductCategoriesSuccess(response));
    } catch (error) {
      dispatch(productCategoriesFailure(error));
    }
  };

export const createProductCategory = (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(productCategoriesStart());
      const response = await ProductService.registerProductCategories(data);
      if (response.success) {
        dispatch(createProductCategorySuccess(response.data));
      } else {
        dispatch(productCategoriesFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(productCategoriesFailure('Unknown error'));
    }
  };

export const updateProductCategory = (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(productCategoriesStart());
      const response = await ProductService.updateProductCategory(data);
      if (response.success) {
        dispatch(updateProductCategorySuccess(response.data));
      } else {
        dispatch(productCategoriesFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(productCategoriesFailure('Unknown error'));
    }
  };


  export const deleteProductCategory =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(productCategoriesStart());
      const response = await ProductService.deleteProductCategory(id);
      if (response.success) {
        dispatch(deleteProductCategorySuccess(response.data));
      } else {
        dispatch(productCategoriesFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(productCategoriesFailure('Unknown error'));
    }
  };


  export const getUnitOfMeasurements = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(unitOfMeasurementsStart());
      const response = await ProductService.getUnitOfMeasurements();
      dispatch(getUnitOfMeasurementsSuccess(response));
    } catch (error) {
      dispatch(unitOfMeasurementsFailure(error));
    }
  };

export const createUnitOfMeasurement = (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(unitOfMeasurementsStart());
      const response = await ProductService.registerUnitOfMeasurements(data);
      if (response.success) {
        dispatch(createUnitOfMeasurementSuccess(response.data));
      } else {
        dispatch(unitOfMeasurementsFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(unitOfMeasurementsFailure('Unknown error'));
    }
  };

export const updateUnitOfMeasurement = (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(unitOfMeasurementsStart());
      const response = await ProductService.updateUnitOfMeasurement(data);
      if (response.success) {
        dispatch(updateUnitOfMeasurementSuccess(response.data));
      } else {
        dispatch(unitOfMeasurementsFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(unitOfMeasurementsFailure('Unknown error'));
    }
  };


  export const deleteUnitOfMeasurement =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(unitOfMeasurementsStart());
      const response = await ProductService.deleteUnitOfMeasurement(id);
      if (response.success) {
        dispatch(deleteUnitOfMeasurementSuccess(response.data));
      } else {
        dispatch(unitOfMeasurementsFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(unitOfMeasurementsFailure('Unknown error'));
    }
  };