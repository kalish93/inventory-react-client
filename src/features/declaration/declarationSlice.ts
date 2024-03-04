import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { Declaration } from "../../models/declaration";

interface DeclarationState {
  declarations: PaginatedList<Declaration>;
  declaration: any;
  loading: boolean;
  error: any | null;
  isError: boolean;
}

const initialState: DeclarationState = {
  declarations: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1
  },
  declaration: undefined,
  loading: false,
  error: null,
  isError: false,
};

const declarationSlice = createSlice({
  name: "declaration",
  initialState,
  reducers: {
    getDeclarationsStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    getDeclarationsSuccess: (state, action) => {
        state.declarations = action.payload;
        state.loading = false;
      },
    getDeclarationsFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    },

    registerDeclarationStart: (state) => {
        state.loading = true;
        state.error = null;
        state.isError = false;
      },
      registerDeclarationSuccess: (state, action) => {
          const newDeclaration = action.payload;
          state.declarations = {
              items: [newDeclaration, ...(state.declarations?.items || [])],
              totalCount: (state.declarations?.totalCount || 0) + 1,
              pageSize: state.declarations?.pageSize || 10, 
              currentPage: state.declarations?.currentPage || 1, 
              totalPages: state.declarations?.totalPages || 1, 
          };
  
          state.loading = false;
          
      },
      registerDeclarationFailure: (state, action) => {
        state.loading = false;
        state.isError = true;
        state.error = action.payload;
      },

      getDeclarationByIdStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      getDeclarationByIdSuccess: (state, action) => {
        state.declaration = action.payload;
        state.loading = false;
      },
      getDeclarationByIdFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },


      deleteDeclarationStart: (state) => {
        state.loading = true;
        state.error = null;
        state.isError = false;
      },
      deleteDeclarationSuccess: (state, action) => {
        const declarationToDelete = action.payload;
        state.declarations = {
          items:
            state.declarations?.items?.filter(
              (declaration) => declaration.id !== declarationToDelete.id
            ) ?? [],
          totalCount: (state.declarations?.totalCount || 0) - 1,
          pageSize: state.declarations?.pageSize || 10,
          currentPage: state.declarations?.currentPage || 1,
          totalPages: state.declarations?.totalPages || 1,
        };
        state.loading = false;
      },
      deleteDeclarationFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isError = true;
      },
  
    },
});

export const {
  getDeclarationsStart,
  getDeclarationsSuccess,
  getDeclarationsFailure,
  registerDeclarationStart,
  registerDeclarationSuccess,
  registerDeclarationFailure,
  getDeclarationByIdStart,
  getDeclarationByIdSuccess,
  getDeclarationByIdFailure,
  deleteDeclarationFailure,
  deleteDeclarationStart,
  deleteDeclarationSuccess
} = declarationSlice.actions;

export const selectDeclaration = (state: { declaration: DeclarationState }) => state.declaration;

export default declarationSlice.reducer;