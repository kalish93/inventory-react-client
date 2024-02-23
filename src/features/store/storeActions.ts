import { 
    storeStart, 
    storeFailure,
    getStoreSuccess,
    createStoreSuccess,
    deleteStoreSuccess,
    updateStoreSuccess
} from './storeSlice';
import { storeService } from './storeServices';
import { AppDispatch } from '../../app/store';
import { CreateStore, Store } from '../../models/store';

export const getStores = (page: number, pageSize: number) => async (dispatch: AppDispatch) => {
    try {
        dispatch(storeStart());
        const response = await storeService.getStores(page, pageSize);
        dispatch(getStoreSuccess(response));
    } catch (error) {
        dispatch(storeFailure(error));
    }
};

export const createStore = (storeData: CreateStore) => async (dispatch: AppDispatch) => {
    try {
        dispatch(storeStart());
        const response = await storeService.createStore(storeData);
        if (response.success) {
          dispatch(createStoreSuccess(response.data));
        } else {
          dispatch(storeFailure(response.error || 'Unknown error'));
        }
      } catch (error) {
        dispatch(storeFailure('Unknown error'));
      }
};

export const deleteStore = (storeId: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(storeStart());
        const response = await storeService.deleteStore(storeId);
        dispatch(deleteStoreSuccess(response));
    } catch (error) {
        dispatch(storeFailure(error));
    }
};

export const updateStore = (storeData: Store) => async (dispatch: AppDispatch) => {
    try {
        dispatch(storeStart());
        const response = await storeService.updateStore(storeData);
        dispatch(updateStoreSuccess(response));
    } catch (error) {
        dispatch(storeFailure(error));
    }
};