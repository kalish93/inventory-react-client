import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { createStore } from "../../features/store/storeActions";
import { AppDispatch } from "../../app/store";
import { selectStore } from "../../features/store/storeSlice";
import * as yup from "yup";
import { useFormik } from "formik";

interface StoreFormProps {
  open: boolean;
  handleClose: () => void;
}

const StoreForm: React.FC<StoreFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectStore);

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
        showSnackbar("Store registered successfully.", "success");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    address: yup.string().required("Address is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(createStore(values));
      setIsFormSubmitted(true);
      handleClose();
      formik.resetForm();
    },
  });
  const handleCancel = () => {
    handleClose();
    formik.resetForm();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            return;
          }
          handleClose();
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Add Store
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              required
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              required
              name="address"
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                Submit
              </Button>
              <Button variant="outlined" color="warning" onClick={handleCancel}>
                cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
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

export default StoreForm;
