import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Snackbar, Alert, Modal, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createDeclarationDetail, updateDeclarationDetail } from '../../features/declaration/declarationAction';
import { getProducts } from '../../features/product/productActions';
import { Autocomplete } from '@mui/material';
import { selectProduct } from '../../features/product/productSlice';
import { AppDispatch } from '../../app/store';
import { useParams } from 'react-router-dom';
import { selectDeclaration } from '../../features/declaration/declarationSlice';

interface DeclarationDetailFormProps {
    open: boolean;
    handleClose: () => void;
    initialValues?: any;
  }

const DeclarationDetailForm: React.FC<DeclarationDetailFormProps> = ({ open, initialValues, handleClose }) => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const productState = useSelector(selectProduct);
  const products = productState.products;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { isError, error, loading, successMessage } = useSelector(selectDeclaration);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const validationSchema = Yup.object().shape({
    productId: Yup.string().required('Product is required'),
    declarationQuantity: Yup.number().required('Declaration Quantity is required'),
    totalIncomeTax: Yup.number().required('Total Income Tax is required'),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      productId: '',
      declarationQuantity: '',
      totalIncomeTax: '',
    },
    validationSchema,
    onSubmit: (values,{setSubmitting}) => {
      if (initialValues) {
        dispatch(updateDeclarationDetail({id: initialValues.id,...values})) 
      } else {
        dispatch(createDeclarationDetail({declarationId: id, ...values}))
      }
      handleClose();
      formik.resetForm();
      setSubmitting(false);
    },
  });

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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(()=>{
    if(initialValues){
    formik.setValues({
        productId: initialValues.product.id,
        declarationQuantity: initialValues.declarationQuantity,
        totalIncomeTax: initialValues.totalIncomeTax,
    })
}
  },[initialValues])

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
      <Typography variant="h6" gutterBottom>
        {initialValues ? 'Update Declaration Detail' : 'Create Declaration Detail'}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Autocomplete
          options={products.items}
          getOptionLabel={(option) => option.name}
          value={products.items.find((p) => p.id === formik.values.productId) || null}
          onChange={(event, newValue) => {
            formik.setFieldValue('productId', newValue ? newValue.id : '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              name="productId"
              label="Product"
              variant="outlined"
              fullWidth
              margin="normal"
              error={formik.touched.productId && Boolean(formik.errors.productId)}
              helperText={formik.touched.productId && formik.errors.productId as React.ReactNode}
            />
          )}
        />
        <TextField
          name="declarationQuantity"
          label="Declaration Quantity"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formik.values.declarationQuantity}
          onChange={formik.handleChange}
          error={formik.touched.declarationQuantity && Boolean(formik.errors.declarationQuantity)}
          helperText={formik.touched.declarationQuantity && formik.errors.declarationQuantity as React.ReactNode}
        />
        <TextField
          name="totalIncomeTax"
          label="Total Income Tax"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formik.values.totalIncomeTax}
          onChange={formik.handleChange}
          error={formik.touched.totalIncomeTax && Boolean(formik.errors.totalIncomeTax)}
          helperText={formik.touched.totalIncomeTax && formik.errors.totalIncomeTax as React.ReactNode}
        />
        <div style={{ display: "flex", gap: "8px" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {initialValues ? 'Update' : 'Create'}
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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity as "success" | "error"}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DeclarationDetailForm;
