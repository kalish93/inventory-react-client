import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectUser } from "../../features/user/userSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Button,
  Card,
  FormHelperText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { changePassword } from "../../features/user/userActions";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { isError, error, loading } = useSelector(selectUser);
  const navigate = useNavigate();

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (isFormSubmitted && !loading) {
      if (isError) {
        showSnackbar(error || "Unknown error", "error");
      } else {
        showSnackbar("Declaration created successfully.", "success");
        navigate("/");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted, navigate]);
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string().required("New password is required"),
      newPasswordConfirmation: Yup.string()
        .required("Confirmation is required")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),

    onSubmit: (values) => {
      dispatch(changePassword({ username: user.username, ...values }));
      setIsFormSubmitted(true);
      formik.resetForm();
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCancel = () => {
    formik.resetForm();
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card style={{ width: "400px", padding: "15px" }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Change Password Form
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            name="oldPassword"
            label="Old Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.oldPassword}
            error={
              formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
            }
          />
          <FormHelperText error>
            {formik.touched.oldPassword && formik.errors.oldPassword}
          </FormHelperText>
          <TextField
            name="newPassword"
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
          />
          <FormHelperText error>
            {formik.touched.newPassword && formik.errors.newPassword}
          </FormHelperText>
          <TextField
            name="newPasswordConfirmation"
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPasswordConfirmation}
            error={
              formik.touched.newPasswordConfirmation &&
              Boolean(formik.errors.newPasswordConfirmation)
            }
          />
          <FormHelperText error>
            {formik.touched.newPasswordConfirmation &&
              formik.errors.newPasswordConfirmation}
          </FormHelperText>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!formik.isValid}
          >
            Submit
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="warning"
            onClick={handleCancel}
            sx={{ marginLeft: 1 }}
          >
            Cancel
          </Button>
        </form>
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
  );
};

export default ChangePassword;
