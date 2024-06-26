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
import { createProduct, getProductCategories, getUnitOfMeasurements, updateProduct } from '../../features/product/productActions';
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
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { isError, error, loading, successMessage, productCategories, unitOfMeasurements } = useSelector(selectProduct);

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
    dispatch(getUnitOfMeasurements());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      id: selectedProduct ? selectedProduct.id : '',
      name: selectedProduct ? selectedProduct.name : '',
      categoryId: selectedProduct ? selectedProduct.category.id : '', // Use categoryId as initial value
      unitOfMeasurementId: selectedProduct ? selectedProduct.unitOfMeasurement.id : '',
      startingQuantity: selectedProduct ? selectedProduct.startingQuantity : '',
      startingQuantityUnitPrice: selectedProduct ? selectedProduct.startingQuantityUnitPrice : '',
      startingQuantityDate: selectedProduct ? selectedProduct.startingQuantityDate.split('T')[0] : '', // Extract date part
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      categoryId: Yup.string().required('Please select a category'),
      unitOfMeasurementId: Yup.string().required('Unit of measurement is required'),
      startingQuantity: Yup.number().required('Starting quanitity is required').min(0, 'Starting quantity must be zero or positive'),
      startingQuantityUnitPrice: Yup.number().required('Unit price required').min(0, 'Unit price must be zero or positive'),
      startingQuantityDate: Yup.date().required('Starting quantity date is required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      const { categoryId, unitOfMeasurementId, startingQuantityDate, ...rest } = values;
      const selectedCategory = productCategories.find((category: any) => category.id === categoryId);
      const selectedUnitOfMeasurement = unitOfMeasurements.find((item: any) => item.id === unitOfMeasurementId);
      const formData = { ...rest, category: selectedCategory, unitOfMeasurement: selectedUnitOfMeasurement, startingQuantityDate: new Date(startingQuantityDate).toISOString() };
      
      if (values.id) {
        dispatch(updateProduct(formData));
      } else {
        dispatch(createProduct(formData));
      }
      setSubmitting(false);
      handleClose();
      setIsFormSubmitted(true);
      formik.resetForm();
    },
  });

    useEffect(() => {
      formik.setValues({
        id: selectedProduct ? selectedProduct.id : '',
        name: selectedProduct ? selectedProduct.name : '',
        categoryId: selectedProduct ? selectedProduct.category.id : '',
        unitOfMeasurementId: selectedProduct ? selectedProduct.unitOfMeasurement.id : '',
        startingQuantity: selectedProduct ? selectedProduct.startingQuantity : '',
        startingQuantityUnitPrice: selectedProduct ? selectedProduct.startingQuantityUnitPrice : '',
        startingQuantityDate: selectedProduct ? selectedProduct.startingQuantityDate.split('T')[0] : '',
      });
    
  }, [selectedProduct]);

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
              select
              name="unitOfMeasurementId"
              label="Unit Of Measurement"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.unitOfMeasurementId && Boolean(formik.errors.unitOfMeasurementId)}
              helperText={formik.touched.unitOfMeasurementId && formik.errors.unitOfMeasurementId as React.ReactNode}
              value={formik.values.unitOfMeasurementId}
            >
              {unitOfMeasurements.map((item: any) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
            {/* <TextField
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
            /> */}
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
