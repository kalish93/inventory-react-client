import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../../features/user/userActions";
import {
  LinearProgress,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  FormControl,
  FormHelperText,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";
import inventoryImage from '../../assets/inventory.png'

const LoginComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector((state: any) => state.user.loading);
  const isAuthenticated = useSelector(
    (state: any) => state.user.isAuthenticated
  );
  const navigate = useNavigate();
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(login(values.username, values.password));
        showSnackbar("Login successful!", "success");
      } catch (error) {
        showSnackbar("Invalid username or password", "error");
      }
    },
  });
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={6} style={{ backgroundColor: "#222831", padding: "2rem" , display:'flex', flexDirection:'column-reverse', alignItems:'center', justifyContent:'center'}}>
        <Typography variant="h3" color="white" gutterBottom style={{textAlign:'center'}}>
          Welcome to F.O.R Inventory Management
        </Typography>
        <img src={inventoryImage} alt="Inventory" style={{ maxWidth: "100%" }} />
        </Grid>

      <Grid item xs={6} style={{ padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {loading && <LinearProgress />}
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Login
              </Typography>
              <form onSubmit={formik.handleSubmit}>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Username"
                    variant="outlined"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.username &&
                      Boolean(formik.errors.username)
                    }
                  />
                  <FormHelperText error>
                    {formik.touched.username && formik.errors.username}
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password &&
                      Boolean(formik.errors.password)
                    }
                  />
                  <FormHelperText error>
                    {formik.touched.password && formik.errors.password}
                  </FormHelperText>
                </FormControl>
                <Button
                  style={{padding:'10px 0 10px 0', fontSize:'16px'}}
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading || !formik.isValid}
                >
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity as "success" | "error"}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </Grid>
    </Grid>
  );
};

export default LoginComponent;
