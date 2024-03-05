import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./app/store";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#267D9E",
    },
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#267D9E",
          },
          "&.Mui-selected": {
            backgroundColor: "#267D9E",
            color: "white",
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        "&:hover": {
          color: "white",
        },
        root: {
          "&.Mui-selected": {
            color: "white",
          },
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>
);
