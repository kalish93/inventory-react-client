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
  CircularProgress,
  MenuItem
} from '@mui/material';
import { AppDispatch } from '../../app/store';
import { createProduct, getProductCategories, updateProduct } from '../../features/product/productActions';
import { selectProduct } from '../../features/product/productSlice';
import * as Yup from 'yup';
import { useFormik } from 'formik';

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
  selectedProduct?: any | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ open, handleClose, selectedProduct }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading, successMessage, productCategories } = useSelector(selectProduct);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    // Dispatch action to get product categories
    dispatch(getProductCategories());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      id: selectedProduct ? selectedProduct.id : '',
      name: selectedProduct ? selectedProduct.name : '',
      categoryId: selectedProduct ? selectedProduct.category.id : '', // Use categoryId as initial value
      unitOfMeasurement: selectedProduct ? selectedProduct.unitOfMeasurement : '',
      startingQuantity: selectedProduct ? selectedProduct.startingQuantity : '',
      startingQuantityUnitPrice: selectedProduct ? selectedProduct.startingQuantityUnitPrice : '',
      startingQuantityDate: selectedProduct ? selectedProduct.startingQuantityDate.split('T')[0] : '', // Extract date part
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('This field is required'),
      categoryId: Yup.string().required('Please select a category'),
      unitOfMeasurement: Yup.string().required('This field is required'),
      startingQuantity: Yup.number().required('This field is required').positive('Starting quantity must be positive'),
      startingQuantityUnitPrice: Yup.number().required('This field is required').positive('Unit price must be positive'),
      startingQuantityDate: Yup.date().required('This field is required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      const { categoryId, startingQuantityDate, ...rest } = values;
      const selectedCategory = productCategories.find((category: any) => category.id === categoryId);
      const formData = { ...rest, category: selectedCategory, startingQuantityDate: new Date(startingQuantityDate).toISOString() };
      
      if (values.id) {
        dispatch(updateProduct(formData));
      } else {
        dispatch(createProduct(formData));
      }
      setSubmitting(false);
      handleClose();
    },
  });

    useEffect(() => {
      formik.setValues({
        id: selectedProduct ? selectedProduct.id : '',
        name: selectedProduct ? selectedProduct.name : '',
        categoryId: selectedProduct ? selectedProduct.category.id : '',
        unitOfMeasurement: selectedProduct ? selectedProduct.unitOfMeasurement : '',
        startingQuantity: selectedProduct ? selectedProduct.startingQuantity : '',
        startingQuantityUnitPrice: selectedProduct ? selectedProduct.startingQuantityUnitPrice : '',
        startingQuantityDate: selectedProduct ? selectedProduct.startingQuantityDate.split('T')[0] : '',
      });
    
  }, [selectedProduct]);

  useEffect(() => {
    if (successMessage) {
      const severity = isError ? 'error' : 'success';
      const message = isError ? (error || 'Unknown error') : successMessage;
      formik.resetForm();
      formik.setSubmitting(false);
      handleClose();
      showSnackbar(message, severity);
    }
  }, [error, isError, loading, successMessage]);
  
  const handleCancel = () => {
    handleClose();
    formik.resetForm();
  };

  if (loading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <div>
      <Modal open={open} onClose={(e, reason) => {
        if (reason === 'backdropClick') {
          return;
        }
        handleClose();
      }}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          maxHeight: '80vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Product Form
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name as React.ReactNode}
              value={formik.values.name}
            />
            <TextField
              select
              name="categoryId"
              label="Category"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
              helperText={formik.touched.categoryId && formik.errors.categoryId as React.ReactNode}
              value={formik.values.categoryId}
            >
              {productCategories.map((category: any) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="unitOfMeasurement"
              label="Unit of Measurement"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.unitOfMeasurement && Boolean(formik.errors.unitOfMeasurement)}
              helperText={formik.touched.unitOfMeasurement && formik.errors.unitOfMeasurement as React.ReactNode}
              value={formik.values.unitOfMeasurement}
            />
            <TextField
              name="startingQuantity"
              label="Starting Quantity"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startingQuantity && Boolean(formik.errors.startingQuantity)}
              helperText={formik.touched.startingQuantity && formik.errors.startingQuantity as React.ReactNode}
              value={formik.values.startingQuantity}
            />
            <TextField
              name="startingQuantityUnitPrice"
              label="Starting Quantity Unit Price"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startingQuantityUnitPrice && Boolean(formik.errors.startingQuantityUnitPrice)}
              helperText={formik.touched.startingQuantityUnitPrice && formik.errors.startingQuantityUnitPrice as React.ReactNode}
              value={formik.values.startingQuantityUnitPrice}
            />
            <TextField
              name="startingQuantityDate"
              label="Starting Quantity Date"
              type="date" // Use type="date" for HTML date selector
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startingQuantityDate && Boolean(formik.errors.startingQuantityDate)}
              helperText={formik.touched.startingQuantityDate && formik.errors.startingQuantityDate as React.ReactNode}
              value={formik.values.startingQuantityDate}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {formik.values.id ? 'Update' : 'Submit'}
              </Button>
              <Button
                variant="outlined"
                color="warning"
                onClick={handleCancel}
              >
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

export default ProductForm;
