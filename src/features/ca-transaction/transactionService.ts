import { CreateCATransaction } from "../../models/ca-transaction";
import { handleRequest } from "../../utils/apiService";
import { CATRANSACTIONS_URL } from "../../core/api-routes";

export const CATransactionService = {
    getCATransactions: async (page = 1, pageSize = 10) => {
        try{
            const url = page && pageSize
                ? `${CATRANSACTIONS_URL}?page=${page}&pageSize=${pageSize}`
                : CATRANSACTIONS_URL;
            const response = await handleRequest(url, {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error('Error retrieving CA Transactions');
            }

            const data = await response.json();
            return data;

        }catch(error){
            console.error('Error in getCATransactions service:', error);
            throw error;
        }
    },

    registerCATransactions: async (CATransactionData: CreateCATransaction) => {
        try{
            const response = await handleRequest(CATRANSACTIONS_URL, {
                method: "POST",
                body: JSON.stringify(CATransactionData),
            });

            if(!response.ok){
                let errorMessage = `Bad Request: ${response.statusText}`;
                const data = await response.json();
                errorMessage = data.error || errorMessage;
                return { success: false, error: errorMessage };
            }

            const data = await response.json();
            return { success: true, data };

        }catch(error) {
            console.error("Error in registerCATransactions service:", error);
            return { success: false, error: "Unexpected error occurred" };
        }
    },
}