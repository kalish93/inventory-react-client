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
  MenuItem,
} from "@mui/material";
import { AppDispatch } from "../../app/store";

import * as yup from "yup";
import { useFormik } from "formik";
import { selectPurchase } from "../../features/purchase/purchaseSlice";
import { getCustomers } from "../../features/customer/customerActions";
import { UpdateSale } from "../../features/sales/salesActions";

interface UpdateSaleFormProps {
  open: boolean;
  handleClose: () => void;
  selectedSale: any;
}

const UpdateSaleForm: React.FC<UpdateSaleFormProps> = ({
  open,
  handleClose,
  selectedSale,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectPurchase);
  const customers = useSelector((state: any) => state.customer.customers.items);

  useEffect(() => {
    dispatch(getCustomers());
  },[dispatch]);

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
        showSnackbar("Sale updated successfully.", "success");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = yup.object({
    invoiceNumber: yup.string().required("Invoice number is required"),
    invoiceDate: yup.date().required("Invoice date is required"),
    customerId: yup.string().required("Supplier is required"),
  });

  const formik = useFormik({
    initialValues: {
      invoiceNumber: selectedSale?.invoiceNumber || "",
      invoiceDate: selectedSale ? selectedSale.invoiceDate.split("T")[0] : "",
      customerId: selectedSale?.customer?.id || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(UpdateSale(selectedSale.id, values));
      setIsFormSubmitted(true);
      handleClose();
    },
  });

  useEffect(() => {
    if (selectedSale) {
      console.log(selectedSale);
      formik.setValues({
        invoiceNumber: selectedSale ? selectedSale.invoiceNumber : "",
        invoiceDate: selectedSale ? selectedSale.invoiceDate.split("T")[0] : "",
        customerId: selectedSale?.customer?.id || "",
      });
    }
  }, [selectedSale]);

  const handleCancel = () => {
    formik.resetForm();
    handleClose();
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
            Update Sale
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              required
              name="invoiceNumber"
              label="Invoice Number"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.invoiceNumber}
              error={formik.touched.invoiceNumber && Boolean(formik.errors.invoiceNumber)}
              helperText={
                formik.touched.invoiceNumber &&
                (formik.errors.invoiceNumber as React.ReactNode)
              }
            />
            <TextField
              required
              name="invoiceDate"
              label="Invoice Date"
              variant="outlined"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.invoiceDate}
              error={formik.touched.invoiceDate && Boolean(formik.errors.invoiceDate)}
              helperText={
                formik.touched.invoiceDate && (formik.errors.invoiceDate as React.ReactNode)
              }
            />

            <TextField
              select
              name="customerId"
              label="Customer"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.customerId && Boolean(formik.errors.customerId)
              }
              helperText={
                formik.touched.customerId &&
                (formik.errors.customerId as React.ReactNode)
              }
              value={formik.values.customerId}
            >
              {customers.map((item: any) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.firstName + " " + item.lastName}
                </MenuItem>
              ))}
            </TextField>

            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!formik.isValid}
              >
                Update
              </Button>
              <Button variant="outlined" color="warning" onClick={handleCancel}>
                Cancel
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
    </div>
  );
};

export default UpdateSaleForm;
