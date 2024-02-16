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
import { createProduct } from '../../features/product/productActions';

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unitOfMeasurement: '',
  });
  const [touched, setTouched] = useState<{
    name?: boolean;
    catetory?: boolean;
    unitOfMeasurement?: boolean;
  }>({});

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = () => {
    dispatch(createProduct(formData));
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
          Product Form
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
        {touched.name && !formData.name && <FormHelperText error>Product name is required</FormHelperText>}
        <TextField
          name="category"
          label="Category"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.catetory && !formData.category}
          onBlur={() => handleBlur('category')}
        />
        {touched.catetory && !formData.category && <FormHelperText error>Product category is required</FormHelperText>}
        <TextField
          name="unitOfMeasurement"
          label="Unit of measurement"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.unitOfMeasurement && !formData.unitOfMeasurement}
          onBlur={() => handleBlur('unitOfMeasurement')}
        />
        {touched.unitOfMeasurement && !formData.unitOfMeasurement && <FormHelperText error>Unit of measurement is required</FormHelperText>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={
            !formData.name ||
            !formData.category||
            !formData.unitOfMeasurement
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

export default ProductForm;
