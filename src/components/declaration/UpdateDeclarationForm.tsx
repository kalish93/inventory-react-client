import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { AppDispatch } from "../../app/store";
import { selectDeclaration } from "../../features/declaration/declarationSlice";
import { updateDeclaration } from "../../features/declaration/declarationAction";
import * as yup from "yup";
import { useFormik } from "formik";

interface UpdateDeclarationFormProps {
  open: boolean;
  handleClose: () => void;
  selectedDeclaration: any;
}

const UpdateDeclarationForm: React.FC<UpdateDeclarationFormProps> = ({
  open,
  handleClose,
  selectedDeclaration,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectDeclaration);

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
        showSnackbar("Declaration updated successfully.", "success");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = yup.object({
    number: yup.string().required("Number is required"),
    date: yup.date().required("Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      number: selectedDeclaration?.number || "",
      date: selectedDeclaration ? selectedDeclaration.date.split("T")[0] : "", // Convert date format
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(updateDeclaration({ id: selectedDeclaration.id, ...values }));
      setIsFormSubmitted(true);
      handleClose();
    },
  });

  useEffect(() => {
    if (selectedDeclaration) {
      formik.setValues({
        number: selectedDeclaration ? selectedDeclaration.number : "",
        date: selectedDeclaration ? selectedDeclaration.date.split("T")[0] : "",
      });
    }
  }, [selectedDeclaration]);

  const handleCancel = () => {
    formik.resetForm()
    handleClose();
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
            Update Declaration
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              required
              name="number"
              label="Number"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.number}
              error={formik.touched.number && Boolean(formik.errors.number)}
              helperText={
                formik.touched.number &&
                (formik.errors.number as React.ReactNode)
              }
            />
            <TextField
              required
              name="date"
              label="Date"
              variant="outlined"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.date}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={
                formik.touched.date && (formik.errors.date as React.ReactNode)
              }
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!formik.isValid}
              >
                Update
              </Button>

              <Button variant="outlined" color="warning" onClick={handleCancel}>
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
    </div>
  );
};

export default UpdateDeclarationForm;
