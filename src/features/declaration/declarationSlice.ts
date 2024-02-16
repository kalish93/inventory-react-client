import { createSlice } from "@reduxjs/toolkit";
import { PaginatedList } from "../../models/commons/paginatedList";
import { Declaration } from "../../models/declaration";

interface DeclarationState {
  declarations: PaginatedList<Declaration>;
  loading: boolean;
  error: any | null;
}

const initialState: DeclarationState = {
  declarations: {
    items: [],
    totalCount: 0,
    pageSize: 0,
    currentPage: 1,
    totalPages: 1
  },
  loading: false,
  error: null,
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
      },
      registerDeclarationSuccess: (state, action) => {
          const newUser = action.payload;
          state.declarations = {
              items: [newUser, ...(state.declarations?.items || [])],
              totalCount: (state.declarations?.totalCount || 0) + 1,
              pageSize: state.declarations?.pageSize || 10, 
              currentPage: state.declarations?.currentPage || 1, 
              totalPages: state.declarations?.totalPages || 1, 
          };
  
          state.loading = false;
          
      },
      registerDeclarationFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
  },
});

export const {
  getDeclarationsStart,
  getDeclarationsSuccess,
  getDeclarationsFailure,
  registerDeclarationStart,
  registerDeclarationSuccess,
  registerDeclarationFailure
} = declarationSlice.actions;

export const selectDeclaration = (state: { declaration: DeclarationState }) => state.declaration;

export default declarationSlice.reducer;