import { AppDispatch } from "../../app/store";
import { ProvisionService } from "./provisionService";
import { getProvisionsFailure, getProvisionsStart, getProvisionsSuccess } from "./provisionSlice";


export const getProvisions = (page?: number, pageSize?: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getProvisionsStart());
      const response = await ProvisionService.getProvisions(page, pageSize);
      dispatch(getProvisionsSuccess(response));
    } catch (error) {
      dispatch(getProvisionsFailure(error));
    }
  };