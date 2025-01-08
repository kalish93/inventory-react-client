// Desc: This file contains the form for adding and updating bank details
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
import { createBank, updateBank } from "../../features/bank/bankActions";
import { AppDispatch } from "../../app/store";
import { selectBank } from "../../features/bank/bankSlice";
import * as yup from "yup";
import { useFormik } from "formik";
import dayjs from "dayjs";

interface BankFormProps {
  open: boolean;
  handleClose: () => void;
  selectedBank?: any;
}

const BankForm: React.FC<BankFormProps> = ({
  open,
  handleClose,
  selectedBank,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading, successMessage } = useSelector(selectBank);

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
      startingValue: null,
      startingValueDate: null,
      ...(selectedBank || {}),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (selectedBank) {
        dispatch(updateBank({ id: selectedBank.id, ...values }));
      } else {
        dispatch(createBank(values));
      }
      setIsFormSubmitted(true);
      handleClose();
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (selectedBank) {
      formik.setValues(selectedBank);
    }
  }, [selectedBank]);
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
            Add Bank
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
              helperText={
                formik.touched.name && (formik.errors.name as React.ReactNode)
              }
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
              helperText={
                formik.touched.address &&
                (formik.errors.address as React.ReactNode)
              }
            />
            <TextField
              required
              name="startingValue"
              label="Starting Value"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.startingValue}
              error={
                formik.touched.startingValue &&
                Boolean(formik.errors.startingValue)
              }
              helperText={
                formik.touched.startingValue &&
                (formik.errors.startingValue as React.ReactNode)
              }
            />
            <TextField
              required
              name="startingValueDate"
              label="Starting Date"
              variant="outlined"
              fullWidth
              margin="normal"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={dayjs(formik.values.startingValueDate).format(
                "YYYY-MM-DD"
              )}
              error={
                formik.touched.startingValueDate &&
                Boolean(formik.errors.startingValueDate)
              }
              helperText={
                formik.touched.startingValueDate &&
                (formik.errors.startingValueDate as React.ReactNode)
              }
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {selectedBank ? "Update" : "Submit"}
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

export default BankForm;
