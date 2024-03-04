import { AppDispatch } from "../../app/store";
import { CreateDeclaration } from "../../models/declaration";
import { DeclarationService } from "./declarationService";
import { deleteDeclarationFailure, deleteDeclarationStart, deleteDeclarationSuccess, getDeclarationByIdFailure, getDeclarationByIdStart, getDeclarationByIdSuccess, getDeclarationsFailure, getDeclarationsStart, getDeclarationsSuccess, registerDeclarationFailure, registerDeclarationStart, registerDeclarationSuccess } from "./declarationSlice";

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