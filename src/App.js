import "./App.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/Router";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#1976d2",
          },
          "&.Mui-selected": {
            backgroundColor: "#1976d2",
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={routes} />
    </ThemeProvider>
  );
}
export default App;
