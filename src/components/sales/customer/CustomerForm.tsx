import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { AppDispatch } from '../../../app/store';
import { createCustomer } from '../../../features/customer/customerActions';

interface CustomerFormProps {
  open: boolean;
  handleClose: () => void;
}

interface FormData {
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

const CustomerForm: React.FC<CustomerFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<FormData>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the error message when the field is being filled
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = () => {
    // Validate form fields
    let hasErrors = false;
    const newErrors: Errors = { ...errors };

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof FormData;
      if (formData[fieldName] === '') {
        newErrors[fieldName] = 'This field is required';
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
    } else {
      // If no errors, submit the form
      dispatch(createCustomer(formData));
      handleClose();
    }
  };

  // Check if all fields are filled
  const isSubmitDisabled = Object.values(formData).some(value => value.trim() === '');

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
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
          required
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          name="middleName"
          label="Middle name"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={!!errors.middleName}
          helperText={errors.middleName}
        />
        <TextField
          name="lastName"
          label="Last name"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <TextField
          name="tinNumber"
          label="Tin number"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={!!errors.tinNumber}
          helperText={errors.tinNumber}
        />
        <TextField
          name="phone"
          label="Phone number"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={!!errors.phone}
          helperText={errors.phone}
        />
        <TextField
          name="address"
          label="Address"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={!!errors.address}
          helperText={errors.address}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default CustomerForm;
