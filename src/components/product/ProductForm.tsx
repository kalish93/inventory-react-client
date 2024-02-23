import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
  Alert,
  Snackbar,
} from "@mui/material";
import { AppDispatch } from "../../app/store";
import { createProduct } from "../../features/product/productActions";
import { selectProduct } from "../../features/product/productSlice";

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const {isError, error, loading} = useSelector(selectProduct)
  
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
        showSnackbar("Product registered successfully.", "success");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unitOfMeasurement: "",
  });
  const [touched, setTouched] = useState<{
    name?: boolean;
    category?: boolean;
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
    setIsFormSubmitted(true);
    setTouched({});
  };

  const handleCancel = () => {
    handleClose();
    setTouched({});
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
          onBlur={() => handleBlur("name")}
        />
        {touched.name && !formData.name && (
          <FormHelperText error>Product name is required</FormHelperText>
        )}
        <TextField
          name="category"
          label="Category"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.category && !formData.category}
          onBlur={() => handleBlur("category")}
        />
        {touched.category && !formData.category && (
          <FormHelperText error>Product category is required</FormHelperText>
        )}
        <TextField
          name="unitOfMeasurement"
          label="Unit of measurement"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.unitOfMeasurement && !formData.unitOfMeasurement}
          onBlur={() => handleBlur("unitOfMeasurement")}
        />
        {touched.unitOfMeasurement && !formData.unitOfMeasurement && (
          <FormHelperText error>Unit of measurement is required</FormHelperText>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={
            !formData.name || !formData.category || !formData.unitOfMeasurement
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
