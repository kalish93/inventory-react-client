import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  createDriver,
  updateDriver,
} from "../../features/driver/driverActions";
import { AppDispatch } from "../../app/store";
import { selectDrivers } from "../../features/driver/driverSlice";

interface DriverFormProps {
  open: boolean;
  handleClose: () => void;
  selectedDriver?: any;
}

const DriverForm: React.FC<DriverFormProps> = ({
  open,
  handleClose,
  selectedDriver,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading, successMessage } =
    useSelector(selectDrivers);

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
        showSnackbar(successMessage, "success");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted, successMessage]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    truckNumber: yup.string().required("Truck Number is required"),
    djboutiPhone: yup.string().required("Djbouti Phone is required"),
    ethiopiaPhone: yup
      .string()
      .required("Ethiopia Phone is required")
      .matches(/^[0-9]{9}$/, "Must be exactly 9 digits"),
    associationName: yup.string().required("Association Name is required"),
    associationPhone: yup.string().required("Association Phone is required"),
    ownerName: yup.string().required("Owner Name is required"),
    ownerPhone: yup
      .string()
      .required("Owner Phone is required")
      .matches(/^[0-9]{9}$/, "Must be exactly 9 digits"),
    driverId: yup.string().required("Driver ID is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      truckNumber: "",
      djboutiPhone: "",
      ethiopiaPhone: "",
      associationName: "",
      associationPhone: "",
      ownerName: "",
      ownerPhone: "",
      driverId: "",
      ...(selectedDriver || {}),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (selectedDriver) {
        dispatch(updateDriver({ id: selectedDriver.id, ...values }));
      } else {
        dispatch(createDriver(values));
      }
      setIsFormSubmitted(true);
      handleClose();
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (selectedDriver) {
      formik.setValues(selectedDriver);
    }
  }, [selectedDriver]);
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
            width: 900,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Add Driver
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <div
              style={{
                display: "flex",
                marginBottom: "20px",
                gap: "3rem",
              }}
            >
              <div style={{ maxWidth: "47%" }}>
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
                    formik.touched.name &&
                    (formik.errors.name as React.ReactNode)
                  }
                />
                <TextField
                  required
                  name="driverId"
                  label="Driver Id"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.driverId}
                  error={
                    formik.touched.driverId && Boolean(formik.errors.driverId)
                  }
                  helperText={
                    formik.touched.driverId &&
                    (formik.errors.driverId as React.ReactNode)
                  }
                />
                <TextField
                  required
                  name="truckNumber"
                  label="Truck Number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.truckNumber}
                  error={
                    formik.touched.truckNumber &&
                    Boolean(formik.errors.truckNumber)
                  }
                  helperText={
                    formik.touched.truckNumber &&
                    (formik.errors.truckNumber as React.ReactNode)
                  }
                />
                <TextField
                  required
                  name="djboutiPhone"
                  label="Djbouti Phone"
                  variant="outlined"
                  fullWidth
                  type="tel"
                  margin="normal"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.djboutiPhone}
                  error={
                    formik.touched.djboutiPhone &&
                    Boolean(formik.errors.djboutiPhone)
                  }
                  helperText={
                    formik.touched.djboutiPhone &&
                    (formik.errors.djboutiPhone as React.ReactNode)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+253</InputAdornment>
                    ),
                    inputProps: { maxLength: 8 },
                  }}
                />
                <TextField
                  required
                  name="ethiopiaPhone"
                  label="Ethiopia Phone"
                  variant="outlined"
                  fullWidth
                  type="tel"
                  margin="normal"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.ethiopiaPhone}
                  error={
                    formik.touched.ethiopiaPhone &&
                    Boolean(formik.errors.ethiopiaPhone)
                  }
                  helperText={
                    formik.touched.ethiopiaPhone &&
                    (formik.errors.ethiopiaPhone as React.ReactNode)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+251</InputAdornment>
                    ),
                    inputProps: { maxLength: 9 },
                  }}
                />
              </div>
              <div style={{ maxWidth: "47%" }}>
                <TextField
                  required
                  name="associationName"
                  label="Association Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.associationName}
                  error={
                    formik.touched.associationName &&
                    Boolean(formik.errors.associationName)
                  }
                  helperText={
                    formik.touched.associationName &&
                    (formik.errors.associationName as React.ReactNode)
                  }
                />
                <TextField
                  required
                  name="associationPhone"
                  label="Association Phone"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.associationPhone}
                  error={
                    formik.touched.associationPhone &&
                    Boolean(formik.errors.associationPhone)
                  }
                  helperText={
                    formik.touched.associationPhone &&
                    (formik.errors.associationPhone as React.ReactNode)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+251</InputAdornment>
                    ),
                    inputProps: { maxLength: 9 },
                  }}
                />
                <TextField
                  required
                  name="ownerName"
                  label="Owner Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.ownerName}
                  error={
                    formik.touched.ownerName && Boolean(formik.errors.ownerName)
                  }
                  helperText={
                    formik.touched.ownerName &&
                    (formik.errors.ownerName as React.ReactNode)
                  }
                />
                <TextField
                  required
                  name="ownerPhone"
                  label="Owner Phone"
                  variant="outlined"
                  fullWidth
                  type="tel"
                  margin="normal"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.ownerPhone}
                  error={
                    formik.touched.ownerPhone &&
                    Boolean(formik.errors.ownerPhone)
                  }
                  helperText={
                    formik.touched.ownerPhone &&
                    (formik.errors.ownerPhone as React.ReactNode)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+251</InputAdornment>
                    ),
                    inputProps: { maxLength: 9 },
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {selectedDriver ? "Update" : "Submit"}
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

export default DriverForm;
