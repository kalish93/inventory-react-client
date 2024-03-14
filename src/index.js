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
      main: "#222831",
    },
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#222831",
            color: "white"
          },
          "&.Mui-selected": {
            backgroundColor: "#222831",
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
