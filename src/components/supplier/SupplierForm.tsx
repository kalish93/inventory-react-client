import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
} from '@mui/material';
import { AppDispatch } from '../../app/store';
import { createSupplier } from '../../features/supplier/supplierActions';

interface SupplierFormProps {
  open: boolean;
  handleClose: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });
  const [touched, setTouched] = useState<{
    name?: boolean;
    address?: boolean;
  }>({});

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = () => {
    dispatch(createSupplier(formData));
    handleClose();
    // setTouched({});
  };

  const handleCancel = () => {
    handleClose();
    // setTouched({});
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Supplier Form
        </Typography>
        <TextField
          name="name"
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.name && !formData.name}
          onBlur={() => handleBlur('name')}
        />
        {touched.name && !formData.name && <FormHelperText error>Supplier name is required</FormHelperText>}
        <TextField
          name="address"
          label="Address"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.address && !formData.address}
          onBlur={() => handleBlur('address')}
        />
        {touched.address && !formData.address && <FormHelperText error>Supplier address is required</FormHelperText>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={
            !formData.name ||
            !formData.address
          }
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={handleCancel}
          sx={{ marginLeft: 1 }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default SupplierForm;
