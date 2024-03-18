import { AppDispatch } from "../../app/store";
import { CreateDeclaration } from "../../models/declaration";
import { DeclarationService } from "./declarationService";
import { createProductDeclarationSuccess, deleteDeclarationFailure, deleteDeclarationStart, deleteDeclarationSuccess, deleteProductDeclarationSuccess, getDeclarationByIdFailure, getDeclarationByIdStart, getDeclarationByIdSuccess, getDeclarationsFailure, getDeclarationsStart, getDeclarationsSuccess, productDeclarationFailure, productDeclarationStart, registerDeclarationFailure, registerDeclarationStart, registerDeclarationSuccess, updateDeclarationFailure, updateDeclarationStart, updateDeclarationSuccess, updateProductDeclarationSuccess } from "./declarationSlice";

export const getDeclarations = (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getDeclarationsStart());
      const response = await DeclarationService.getDeclarations(page, pageSize);
      dispatch(getDeclarationsSuccess(response));
    } catch (error) {
      dispatch(getDeclarationsFailure(error));
      throw(error)
    }
  };

export const createDeclaration = (data: CreateDeclaration) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerDeclarationStart());
  
      const response = await DeclarationService.registerDeclaration(data);
      if (response.success) {
        dispatch(registerDeclarationSuccess(response.data));
      } else {
        dispatch(registerDeclarationFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(registerDeclarationFailure('Unknown error'));
    }
  };

export const getDeclaration = (id:any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getDeclarationByIdStart());
      const response = await DeclarationService.getDeclarationById(id);
      dispatch(getDeclarationByIdSuccess(response));
    } catch (error) {
      dispatch(getDeclarationByIdFailure(error));
      throw(error)
    }
  };

  export const deleteDeclaration = (id: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(deleteDeclarationStart());
  
      const response = await DeclarationService.deleteDeclaration(id);
      if (response.success) {
        dispatch(deleteDeclarationSuccess(response.data));
      } else {
        dispatch(deleteDeclarationFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(deleteDeclarationFailure('Unknown error'));
    }
  };

  export const updateDeclaration = (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(updateDeclarationStart());
  
      const response = await DeclarationService.updateDeclaration(data);
      if (response.success) {
        dispatch(updateDeclarationSuccess(response.data));
      } else {
        dispatch(updateDeclarationFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(updateDeclarationFailure('Unknown error'));
    }
  };
  export const deleteDeclarationDetail = (id: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(productDeclarationStart());
  
      const response = await DeclarationService.deleteDeclarationDetail(id);
      if (response.success) {
        dispatch(deleteProductDeclarationSuccess(response.data));
      } else {
        dispatch(productDeclarationFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(productDeclarationFailure('Unknown error'));
    }
  };

  export const updateDeclarationDetail = (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(productDeclarationStart());
  
      const response = await DeclarationService.updateDeclarationDetail(data);
      if (response.success) {
        dispatch(updateProductDeclarationSuccess(response.data));
      } else {
        dispatch(productDeclarationFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(productDeclarationFailure('Unknown error'));
    }
  };
  
  export const createDeclarationDetail = (data: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(productDeclarationStart());
  
      const response = await DeclarationService.createDeclarationDetail(data);
      if (response.success) {
        dispatch(createProductDeclarationSuccess(response.data));
      } else {
        dispatch(productDeclarationFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(productDeclarationFailure('Unknown error'));
    }
  };