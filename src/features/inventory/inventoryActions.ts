import { AppDispatch } from "../../app/store";
import { InventoryService } from "./inventoryService";
import { getInventoriesFailure, getInventoriesStart, getInventoriesSuccess,  } from "./inventorySlice";

export const getInventories = (page: number, pageSize: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(getInventoriesStart());
  
      const response = await InventoryService.getInventories(page, pageSize);
  
      if (response.success) {
        dispatch(getInventoriesSuccess(response.data));
      } else {
        dispatch(getInventoriesFailure(response.error || 'Unknown error'));
      }
    } catch (error) {
      dispatch(getInventoriesFailure('Unknown error'));
    }
  };