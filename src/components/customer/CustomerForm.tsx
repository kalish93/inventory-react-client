import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { AppDispatch } from '../../app/store';
import { createCustomer, updateCustomer } from '../../features/customer/customerActions';
import { selectCustomer } from '../../features/customer/customerSlice';

interface CustomerFormProps {
  open: boolean;
  handleClose: () => void;
  selectedCustomer?: FormData | null;
}

interface FormData {
  id?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  tinNumber: string;
  phone: string;
  address: string;
}

interface Errors {
  firstName: string;
  middleName: string;
  lastName: string;
  tinNumber: string;
  phone: string;
  address: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ open, handleClose, selectedCustomer }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading, successMessage } = useSelector(selectCustomer);

  const [formData, setFormData] = useState<FormData>({
    id: undefined,
    firstName: '',
    middleName: '',
    lastName: '',
    tinNumber: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Errors>({
    firstName: '',
    middleName: '',
    lastName: '',
    tinNumber: '',
    phone: '',
    address: '',
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone' && value.trim().length !== 9) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Phone number must be exactly 9 digits',
      }));
    } else if (value.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'This field is required',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = () => {
    let hasErrors = false;
    const newErrors: Errors = { ...errors };

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof FormData;
      if (fieldName !== 'id' && formData[fieldName] === '') {
        newErrors[fieldName] = 'This field is required';
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
    } else {
      if (formData.id) {
        dispatch(updateCustomer(formData));
      } else {
        dispatch(createCustomer(formData));
      }

      setIsFormSubmitted(true);
      handleClose();
    }
  };

  useEffect(() => {
    if (isFormSubmitted && successMessage) {
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

  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        id: selectedCustomer.id,
        firstName: selectedCustomer.firstName,
        middleName: selectedCustomer.middleName,
        lastName: selectedCustomer.lastName,
        tinNumber: selectedCustomer.tinNumber,
        phone: selectedCustomer.phone,
        address: selectedCustomer.address,
      });
    } else {
      setFormData({
        id: undefined,
        firstName: '',
        middleName: '',
        lastName: '',
        tinNumber: '',
        phone: '',
        address: '',
      });
    }
  }, [selectedCustomer]);

  const resetErrors = () => {
    setErrors({
      firstName: '',
      middleName: '',
      lastName: '',
      tinNumber: '',
      phone: '',
      address: '',
    });
  };

  const handleCancel = () => {
    resetErrors();
    handleClose();
  };

  const isSubmitDisabled = Object.entries(formData).some(([key, value]) => {
    if (key === 'id') {
      return false;
    }
    return value === undefined || value.trim() === '';
  });
  
  if (loading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <div>
      <Modal open={open} onClose={(e, reason) => {
        if (reason === "backdropClick") {
          return;
        }
        handleClose();
      }}>
        <Box sx={{
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
        }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Customer Form
          </Typography>
          <TextField
            name="firstName"
            label="First name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={!!errors.firstName}
            helperText={errors.firstName}
            value={formData.firstName}
          />
          <TextField
            name="middleName"
            label="Middle name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={!!errors.middleName}
            helperText={errors.middleName}
            value={formData.middleName}
          />
          <TextField
            name="lastName"
            label="Last name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={!!errors.lastName}
            helperText={errors.lastName}
            value={formData.lastName}
          />
          <TextField
            name="tinNumber"
            label="Tin number"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={!!errors.tinNumber}
            helperText={errors.tinNumber}
            value={formData.tinNumber}
          />
          <TextField
            name="phone"
            label="Phone number"
            variant="outlined"
            fullWidth
            margin="normal"
            type="tel"
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={!!errors.phone}
            helperText={errors.phone}
            value={formData.phone}
            InputProps={{
              startAdornment: <InputAdornment position="start">+251</InputAdornment>,
              inputProps: { maxLength: 9 },
            }}
          />
          <TextField
            name="address"
            label="Address"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={!!errors.address}
            helperText={errors.address}
            value={formData.address}
          />
          <div style={{ display: 'flex', gap: "8px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              {formData.id ? "Update" : "Submit"}
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleCancel}
            >
              cancel
            </Button>
          </div>
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

export default CustomerForm;
