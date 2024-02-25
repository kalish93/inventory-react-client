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


interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  formName: string;
}

const CATransactionsForm: React.FC<ProductFormProps> = ({
  open,
  handleClose,
  title,
  formName,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectProduct);

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
        showSnackbar("Transaction registered successfully.", "success");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [formData, setFormData] = useState({
    bankName: "",
    formName: "",
    date: "",
    amount: "",
    transactionRemark: "",
  });
  const [touched, setTouched] = useState<{
    bankName?: boolean;
    formName?: boolean;
    date?: boolean;
    amount?: boolean;
    transactionRemark?: boolean;
  }>({});

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = () => {
    // dispatch(createProduct(formData));
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
            {title} Form
          </Typography>
          <TextField
            name="bankName"
            label="Bank Name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
            error={touched.bankName && !formData.bankName}
            onBlur={() => handleBlur("bankName")}
          />
          {touched.bankName && !formData.bankName && (
            <FormHelperText error>Bank Name is required</FormHelperText>
          )}
          <TextField
            name={formName}
            label={formName}
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
            error={touched.name && !formData.name}
            onBlur={() => handleBlur({ formName })}
          />
          {touched.fromName && !formData.formName && (
            <FormHelperText error>{formName} is required</FormHelperText>
          )}
          <TextField
            name="date"
            label="transaction Date"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
            error={touched.date && !formData.date}
            onBlur={() => handleBlur("date")}
          />
          {touched.date && !formData.date && (
            <FormHelperText error>Transaction date is required</FormHelperText>
          )}
          <TextField
            name="amount"
            label="Amount"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
            error={touched.category && !formData.category}
            onBlur={() => handleBlur("amount")}
          />
          {touched.amount && !formData.amount && (
            <FormHelperText error>
              Transaction amount is required
            </FormHelperText>
          )}
          <TextField
            name="transactionRemark"
            label="Transaction Remark"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            error={touched.transactionRemark && !formData.transactionRemark}
            onBlur={() => handleBlur("transactionRemark")}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={
              !formData.name ||
              !formData.category ||
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

export default CATransactionsForm;
