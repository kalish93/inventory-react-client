import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";

interface SalesState {
  sales: PaginatedList<any>;
  loading: boolean;
  error: any | null;
  sale: any;
  isError: boolean;
  successMessage: any;
  invoiceNumber:number
}

const initialState: SalesState = {
  sales: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1
  },
  loading: false,
  error: null,
  sale: null,
  isError: false,
  successMessage: null,
  invoiceNumber: 0
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    getSalesStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    getSalesSuccess: (state, action) => {
        state.sales = action.payload;
        state.loading = false;
      },
    getSalesFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    },

    registerSaleStart: (state) => {
        state.loading = true;
        state.error = null;
        state.isError = false;
      },
      registerSaleSuccess: (state, action) => {
          const newSale = action.payload;
          state.sales = {
              items: [newSale, ...(state.sales?.items || [])],
              totalCount: (state.sales?.totalCount || 0) + 1,
              pageSize: state.sales?.pageSize || 10, 
              currentPage: state.sales?.currentPage || 1, 
              totalPages: state.sales?.totalPages || 1, 
          };
  
          state.loading = false;
          
      },
      registerSaleFailure: (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      },

      getSaleByIdStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      getSaleByIdSuccess: (state, action) => {
        state.sale = action.payload;
        state.loading = false;
      },
      getSaleByIdFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      deleteSaleSuccess: (state, action) => {
        const deletedSale = action.payload;
        state.sales = {
          items: state.sales?.items.filter(sale => sale.id !== deletedSale.id) || [],
          totalCount: (state.sales?.totalCount || 0) - 1,
          pageSize: state.sales?.pageSize || 10,
          currentPage: state.sales?.currentPage || 1,
          totalPages: state.sales?.totalPages || 1,
        };
      },

      saleStart: (state) => {
        state.loading = true;
        state.error = null;
        state.isError = false;
      },

      updatesaleSuccess: (state, action) =>{
        const updatedSale = action.payload;
        state.sales = {
          items:
            state.sales?.items?.map((sale) =>
            sale.id === updatedSale.id ? updatedSale : sale
            ) ?? [],
          totalCount: state.sales?.totalCount || 0,
          pageSize: state.sales?.pageSize || 10,
          currentPage: state.sales?.currentPage || 1,
          totalPages: state.sales?.totalPages || 1,
        };
        state.loading = false;
      },


      updateSaleDetailSuccess: (state, action) => {
        const updatedSaleDetail = action.payload;
        state.sale.saleDetails = state.sale?.saleDetails?.map((product: any) =>
        product.id === updatedSaleDetail.id ? updatedSaleDetail : product
            ) ?? [];
        
        state.loading = false;
        state.successMessage = "Sale detail updated successfully.";
      },

      deleteSaleDetailSuccess: (state, action) => {
        const saleDetailToDelete = action.payload;

        state.sale.saleDetails = state.sale?.saleDetails?.filter(
          (product: any) => product.id !== saleDetailToDelete.id
        ) ?? [];
        state.loading = false;        
      },

      createSaleDetailSuccess: (state, action) => {
        const product = action.payload;

        state.sale.saleDetails = [product, ...state.sale?.saleDetails]
        state.loading = false;   
        state.successMessage = "Sale detail created successfully";
      },


      saleFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isError = true;
      },
      getInvoiceNumberSuccess: (state,action) => {
        state.invoiceNumber = action.payload;
      },
      getInvoiceNumberFailure: (state,action) => {
        state.error = action.payload;
      },
  },
});

export const {
  getSalesStart,
  getSalesSuccess,
  getSalesFailure,
  registerSaleStart,
  registerSaleSuccess,
  registerSaleFailure,
  getSaleByIdStart,
  getSaleByIdSuccess,
  getSaleByIdFailure,
  deleteSaleSuccess,
  saleStart,
  updatesaleSuccess,
  saleFailure,
  updateSaleDetailSuccess,
  deleteSaleDetailSuccess,
  createSaleDetailSuccess,
  getInvoiceNumberSuccess,
  getInvoiceNumberFailure
} = salesSlice.actions;

export const selectSale = (state: { sale: SalesState }) => state.sale;

export default salesSlice.reducer;
