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
import { AppDispatch } from "../../app/store";
import * as yup from "yup";
import { useFormik } from "formik";
import { selectSupplier } from "../../features/supplier/supplierSlice";
import { createSupplier, updateSupplier } from "../../features/supplier/supplierActions";

interface SupplierFormProps {
  open: boolean;
  handleClose: () => void;
  selectedSupplier?: any;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ open, handleClose, selectedSupplier }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading, successMessage } = useSelector(selectSupplier);

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
        showSnackbar(successMessage as string, "success");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted, successMessage]);

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
      ...(selectedSupplier || {}),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (selectedSupplier) {
        dispatch(updateSupplier({ id: selectedSupplier.id, ...values }));
      } else {
        dispatch(createSupplier(values));
      }
      setIsFormSubmitted(true);
      handleClose();
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (selectedSupplier) {
      formik.setValues(selectedSupplier);
    }
  }, [selectedSupplier]);
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
            Add Supplier
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
              helperText={formik.touched.name && formik.errors.name as React.ReactNode}
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
              helperText={formik.touched.address && formik.errors.address as React.ReactNode}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {selectedSupplier ? 'Update' : 'Submit'}
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

export default SupplierForm;
