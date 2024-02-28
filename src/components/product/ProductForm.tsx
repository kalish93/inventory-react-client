// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   FormHelperText,
//   Alert,
//   Snackbar,
// } from "@mui/material";
// import { AppDispatch } from "../../app/store";
// import { createProduct } from "../../features/product/productActions";
// import { selectProduct } from "../../features/product/productSlice";

// interface ProductFormProps {
//   open: boolean;
//   handleClose: () => void;
//   selectedProduct?: any;
// }

// const ProductForm: React.FC<ProductFormProps> = ({ open, handleClose, selectedProduct }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [isFormSubmitted, setIsFormSubmitted] = useState(false);
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const {isError, error, loading, successMessage} = useSelector(selectProduct)
  
//   const showSnackbar = (message: string, severity: "success" | "error") => {
//     setSnackbarMessage(message);
//     setSnackbarSeverity(severity);
//     setSnackbarOpen(true);
//   };

//   useEffect(() => {
//     if (isFormSubmitted && !loading) {
//       if (isError) {
//         showSnackbar(error || "Unknown error", "error");
//       } else {
//         showSnackbar(successMessage as string, "success");
//       }
//       setIsFormSubmitted(false);
//     }
//   }, [error, isError, loading, isFormSubmitted, successMessage]);

//   const handleCloseSnackbar = () => {
//     setSnackbarOpen(false);
//   };
  

//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     unitOfMeasurement: "",
//   });
//   const [touched, setTouched] = useState<{
//     name?: boolean;
//     category?: boolean;
//     unitOfMeasurement?: boolean;
//   }>({});

//   const handleChange = (e: { target: { name: any; value: any } }) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleBlur = (field: keyof typeof formData) => {
//     setTouched({ ...touched, [field]: true });
//   };

//   const handleSubmit = () => {
//     dispatch(createProduct(formData));
//     handleClose();
//     setIsFormSubmitted(true);
//     setTouched({});
//   };

//   const handleCancel = () => {
//     handleClose();
//     setTouched({});
//   };

//   return (
//     <div>
//     <Modal
//       open={open}
//       onClose={(e, reason) => {
//         if (reason === "backdropClick") {
//           return;
//         }
//         handleClose();
//       }}
//     >
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 500,
//           maxHeight: "80vh",
//           overflowY: "auto",
//           bgcolor: "background.paper",
//           boxShadow: 24,
//           p: 4,
//         }}
//       >
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           Product Form
//         </Typography>
//         <TextField
//           name="name"
//           label="Name"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           onChange={handleChange}
//           required
//           error={touched.name && !formData.name}
//           onBlur={() => handleBlur("name")}
//         />
//         {touched.name && !formData.name && (
//           <FormHelperText error>Product name is required</FormHelperText>
//         )}
//         <TextField
//           name="category"
//           label="Category"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           onChange={handleChange}
//           required
//           error={touched.category && !formData.category}
//           onBlur={() => handleBlur("category")}
//         />
//         {touched.category && !formData.category && (
//           <FormHelperText error>Product category is required</FormHelperText>
//         )}
//         <TextField
//           name="unitOfMeasurement"
//           label="Unit of measurement"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           onChange={handleChange}
//           required
//           error={touched.unitOfMeasurement && !formData.unitOfMeasurement}
//           onBlur={() => handleBlur("unitOfMeasurement")}
//         />
//         {touched.unitOfMeasurement && !formData.unitOfMeasurement && (
//           <FormHelperText error>Unit of measurement is required</FormHelperText>
//         )}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSubmit}
//           disabled={
//             !formData.name || !formData.category || !formData.unitOfMeasurement
//           }
//         >
//           Submit
//         </Button>
//         <Button
//           variant="outlined"
//           color="warning"
//           onClick={handleCancel}
//           sx={{ marginLeft: 1 }}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Modal>
//     <Snackbar
//     open={snackbarOpen}
//     autoHideDuration={6000}
//     onClose={handleCloseSnackbar}
//     anchorOrigin={{ vertical: "top", horizontal: "center" }}
//   >
//     <Alert
//       onClose={handleCloseSnackbar}
//       severity={snackbarSeverity as "success" | "error"}
//       sx={{ width: "100%" }}
//     >
//       {snackbarMessage}
//     </Alert>
//   </Snackbar>
//   </div>
//   );
// };

// export default ProductForm;
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
  CircularProgress
} from '@mui/material';
import { AppDispatch } from '../../app/store';
import { createProduct, updateProduct } from '../../features/product/productActions';
import { selectProduct } from '../../features/product/productSlice';

interface FormData {
  id?: string;
  name: string;
  category: string;
  unitOfMeasurement: string;
}

interface Errors {
  name: string;
  category: string;
  unitOfMeasurement: string;
}

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
  selectedProduct?: FormData | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ open, handleClose, selectedProduct }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading, successMessage } = useSelector(selectProduct);

  const [formData, setFormData] = useState<FormData>({
    id: undefined,
    name: '',
    category: '',
    unitOfMeasurement: '',
  });

  const [errors, setErrors] = useState<Errors>({
    name: '',
    category: '',
    unitOfMeasurement: '',
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.trim() === '') {
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
        dispatch(updateProduct(formData));
      } else {
        dispatch(createProduct(formData));
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
    if (selectedProduct) {
      setFormData({
        id: selectedProduct.id,
        name: selectedProduct.name,
        category: selectedProduct.category,
        unitOfMeasurement: selectedProduct.unitOfMeasurement,
      });
    } else {
      setFormData({
        id: undefined,
        name: '',
        category: '',
        unitOfMeasurement: '',
      });
    }
  }, [selectedProduct]);

  const resetErrors = () => {
    setErrors({
      name: '',
      category: '',
      unitOfMeasurement: '',
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
            Product Form
          </Typography>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={!!errors.name}
            helperText={errors.name}
            value={formData.name}
          />
          <TextField
            name="category"
            label="Category"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={!!errors.category}
            helperText={errors.category}
            value={formData.category}
          />
          <TextField
            name="unitOfMeasurement"
            label="Unit of Measurement"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={!!errors.unitOfMeasurement}
            helperText={errors.unitOfMeasurement}
            value={formData.unitOfMeasurement}
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

export default ProductForm;
