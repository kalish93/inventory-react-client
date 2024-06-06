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
import { getSuppliers } from "../../features/supplier/supplierActions";
import { updatePurchase } from "../../features/purchase/purchaseActions";
import { getDrivers } from "../../features/driver/driverActions";

interface UpdatePurchaseFormProps {
  open: boolean;
  handleClose: () => void;
  selectedPurchase: any;
}

const UpdatePurchaseForm: React.FC<UpdatePurchaseFormProps> = ({
  open,
  handleClose,
  selectedPurchase,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectPurchase);
  const suppliers = useSelector((state: any) => state.supplier.suppliers.items);
  const drivers = useSelector((state: any) => state.driver.drivers.items);

  useEffect(() => {
    dispatch(getSuppliers());
  },[dispatch]);

  useEffect(() => {
    dispatch(getDrivers());
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
        showSnackbar("Purchase updated successfully.", "success");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = yup.object({
    number: yup.string().required("Number is required"),
    date: yup.date().required("Date is required"),
    truckNumber: yup.string().required("Truck number is required"),
    transportCost: yup
      .number()
      .required("Transport cost is required")
      .positive("Transport cost must be a positive number"),
    eslCustomCost: yup
      .number()
      .required("ESL custom cost is required")
      .positive("ESL custom cost must be a positive number"),
    supplierId: yup.string().required("Supplier is required"),
    transitFees: yup
      .number()
      .required("Transit fees are required")
      .positive("Transit fees must be a positive number"),
  });

  const formik = useFormik({
    initialValues: {
      number: selectedPurchase?.number || "",
      date: selectedPurchase ? selectedPurchase.date.split("T")[0] : "",
      truckNumber: selectedPurchase?.truckNumber || "",
      exchangeRate: selectedPurchase?.exchangeRate || "",
      transportCost: selectedPurchase?.transportCost || "",
      eslCustomCost: selectedPurchase?.eslCustomCost || "",
      supplierId: selectedPurchase?.supplier?.id || "", // Corrected supplierId initialization

      transitFees: selectedPurchase?.transitFees || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Dispatch update action with values
      dispatch(updatePurchase(selectedPurchase.id, values));
      setIsFormSubmitted(true);
      handleClose();
    },
  });

  useEffect(() => {
    if (selectedPurchase) {
      formik.setValues({
        number: selectedPurchase ? selectedPurchase.number : "",
        date: selectedPurchase ? selectedPurchase.date.split("T")[0] : "",
        truckNumber: selectedPurchase?.truckNumber || "",
        exchangeRate: selectedPurchase?.exchangeRate || "",
        transportCost: selectedPurchase?.totalTransportCost || "",
        eslCustomCost: selectedPurchase?.totalEslCost || "",
        supplierId: selectedPurchase?.supplier?.id || "",
        transitFees: selectedPurchase?.totalTransitCost || "",
      });
    }
  }, [selectedPurchase]);

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
            Update Purchase
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              required
              name="number"
              label="Number"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.number}
              error={formik.touched.number && Boolean(formik.errors.number)}
              helperText={
                formik.touched.number &&
                (formik.errors.number as React.ReactNode)
              }
            />
            <TextField
              required
              name="date"
              label="Date"
              variant="outlined"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.date}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={
                formik.touched.date && (formik.errors.date as React.ReactNode)
              }
            />

            <TextField
              select
              name="truckNumber"
              label="Truck Number"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.truckNumber && Boolean(formik.errors.truckNumber)
              }
              helperText={
                formik.touched.truckNumber &&
                (formik.errors.truckNumber as React.ReactNode)
              }
              value={formik.values.truckNumber}
            >
              {drivers.map((d: any) => (
                <MenuItem key={d.id} value={d.truckNumber}>
                  {d.truckNumber}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              name="supplierId"
              label="Supplier"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.supplierId && Boolean(formik.errors.supplierId)
              }
              helperText={
                formik.touched.supplierId &&
                (formik.errors.supplierId as React.ReactNode)
              }
              value={formik.values.supplierId}
            >
              {suppliers.map((supplier: any) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </TextField>

            {formik.values.supplierId &&
              suppliers.find(
                (supplier: any) => supplier.id === formik.values.supplierId
              )?.currency === "USD" && (
                <>
                  <TextField
                    required
                    name="exchangeRate"
                    label="Exchange Rate"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.exchangeRate}
                    error={
                      formik.touched.exchangeRate &&
                      Boolean(formik.errors.exchangeRate)
                    }
                    helperText={
                      formik.touched.exchangeRate &&
                      (formik.errors.exchangeRate as React.ReactNode)
                    }
                  />
                </>
              )}
            <TextField
              required
              name="transportCost"
              label="Transport Cost"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.transportCost}
              error={
                formik.touched.transportCost &&
                Boolean(formik.errors.transportCost)
              }
              helperText={
                formik.touched.transportCost &&
                (formik.errors.transportCost as React.ReactNode)
              }
            />
            <TextField
              required
              name="eslCustomCost"
              label="ESL Custom Cost"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.eslCustomCost}
              error={
                formik.touched.eslCustomCost &&
                Boolean(formik.errors.eslCustomCost)
              }
              helperText={
                formik.touched.eslCustomCost &&
                (formik.errors.eslCustomCost as React.ReactNode)
              }
            />

            <TextField
              required
              name="transitFees"
              label="Transit Fees"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.transitFees}
              error={
                formik.touched.transitFees && Boolean(formik.errors.transitFees)
              }
              helperText={
                formik.touched.transitFees &&
                (formik.errors.transitFees as React.ReactNode)
              }
            />
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

export default UpdatePurchaseForm;
