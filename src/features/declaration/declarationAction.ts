import { AppDispatch } from "../../app/store";
import { CreateDeclaration } from "../../models/declaration";
import { DeclarationService } from "./declarationService";
import { getDeclarationByIdFailure, getDeclarationByIdStart, getDeclarationByIdSuccess, getDeclarationsFailure, getDeclarationsStart, getDeclarationsSuccess, registerDeclarationFailure, registerDeclarationStart, registerDeclarationSuccess } from "./declarationSlice";

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
      dispatch(registerDeclarationSuccess(response));
    } catch (error) {
      dispatch(registerDeclarationFailure(error));
      throw(error)
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