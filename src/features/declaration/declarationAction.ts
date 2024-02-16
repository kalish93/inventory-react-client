import { AppDispatch } from "../../app/store";
import { CreateDeclaration } from "../../models/declaration";
import { DeclarationService } from "./declarationService";
import { getDeclarationsFailure, getDeclarationsStart, getDeclarationsSuccess, registerDeclarationFailure, registerDeclarationStart, registerDeclarationSuccess } from "./declarationSlice";

export const getDeclarations = (page: number, pageSize: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getDeclarationsStart());
      const response = await DeclarationService.getDeclarations(page, pageSize);
      dispatch(getDeclarationsSuccess(response));
    } catch (error) {
      dispatch(getDeclarationsFailure(error));
    }
  };

export const createDeclaration = (data: CreateDeclaration) => async (dispatch: AppDispatch) => {
    try {
      dispatch(registerDeclarationStart());
      const response = await DeclarationService.registerDeclaration(data);
      dispatch(registerDeclarationSuccess(response));
    } catch (error) {
      dispatch(registerDeclarationFailure(error));
    }
  };