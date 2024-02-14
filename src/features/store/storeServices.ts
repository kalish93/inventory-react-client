import { STORE_URL } from '../../core/api-routes';
import { CreateStore, Store } from '../../models/store';

export const storeService = {
    getStores: async (page=1, pageSize=10) => {
        try {
            const response = await fetch(`${STORE_URL}?page=${page}&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get stores');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error', error);
            throw error;
        }
    },

    createStore: async (storeData: CreateStore) => {
        try {
            const response = await fetch(STORE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(storeData)
            });

            if (!response.ok) {
                throw new Error('Failed to create store');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error', error);
            throw error;
        }
    },

    updateStore: async (storeData: Store) => {
        try {
            const response = await fetch(`${STORE_URL}/${storeData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(storeData)
            });

            if (!response.ok) {
                throw new Error('Failed to update store');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error', error);
            throw error;
        }
    },

    deleteStore: async (storeId: string) => {
        try {
            const response = await fetch(`${STORE_URL}/${storeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete store');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error', error);
            throw error;
        }
    },

    getStore: async (storeId: string) => {
        try {
            const response = await fetch(`${STORE_URL}/${storeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get store');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error', error);
            throw error;
        }
    }

};