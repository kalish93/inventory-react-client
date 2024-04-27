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
  Autocomplete,
} from "@mui/material";
import { AppDispatch } from "../../app/store";
import { selectTransactions } from "../../features/ca-transaction/transactionSlice";
import { createCATransaction } from "../../features/ca-transaction/transactionActions";
import {
  getCashOfAccountBanks,
  getCashOfAccountExpenses,
} from "../../features/cash-of-account/cashOfAccountActions";
import { getSuppliers } from "../../features/supplier/supplierActions";
import dayjs from "dayjs";
import { getCustomers } from "../../features/customer/customerActions";
import { useFormik } from "formik";
import * as yup from "yup";

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
}

const CATransactionsForm: React.FC<ProductFormProps> = ({
  open,
  handleClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const cashOfAccountBanks = useSelector(
    (state: any) => state.cashOfAccount.banks
  );
  const cashOfAccountExpenses = useSelector(
    (state: any) => state.cashOfAccount.expenses
  );
  const customers = useSelector((state: any) => state.customer.customers.items);

  const suppliers = useSelector((state: any) => state.supplier.suppliers.items);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectTransactions);
  const [title, setTitle] = useState("");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getCashOfAccountBanks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCashOfAccountExpenses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSuppliers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

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

  const validationSchema = yup.object({
    chartofAccountId1: yup.string().required("Bank name is required"),
    chartofAccountId2: yup.string().required("Expense name is required"),
    date: yup.string().required("Transaction date is required"),
    amount: yup.number().required("Transaction amount is required"),
  });

  const formik = useFormik({
    initialValues: {
      chartofAccountId1: "",
      chartofAccountId2: "",
      date: null,
      amount: 0,
      transactionRemark: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let newFormData = {
        chartofAccountId1: values.chartofAccountId1,
        chartofAccountId2: values.chartofAccountId2,
        date: values.date,
        remark: values.transactionRemark,
        credit: "",
        debit: "",
        purchaseId: "",
      };
      if (title === "Add Expense") {
        newFormData.credit = values.amount.toString();
      } else if (title === "Add Supplier Payment") {
        newFormData.chartofAccountId2 = "9145a724-1650-4416-bbcf-f1e1ac3619e5";
        newFormData.debit = values.amount.toString();
      } else if (title === "Add Customer Payment") {
        const customer = customers.find(
          (customer: { id: string }) => customer.id === values.chartofAccountId2
        );
        newFormData.chartofAccountId2 = "6e57436a-8c19-426a-a260-f8fc5e6de0e1";
        newFormData.remark = `Payment made by ${customer.firstName} for ${values.transactionRemark}`;
        newFormData.debit = values.amount.toString();
      } else if (title === "Add Transport Payment") {
        newFormData.purchaseId = values.chartofAccountId2;
        newFormData.chartofAccountId2 = "3f2d5f0e-7ac4-4fd4-b4b6-bf7ae1f05f4c";
        newFormData.debit = values.amount.toString();
      }
      dispatch(createCATransaction(newFormData));
      setIsFormSubmitted(true);
      handleClose();
      formik.resetForm();
    },
  });

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
            width: 1000,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="div">
            {title} Form
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <div style={{ width: "45%" }}>
              <Autocomplete
                options={cashOfAccountBanks}
                getOptionLabel={(option) => option.name}
                value={
                  cashOfAccountBanks.find(
                    (d: { id: string }) =>
                      d.id === formik.values.chartofAccountId1
                  ) || null
                }
                onChange={(event, newValue) => {
                  formik.setFieldValue(
                    "chartofAccountId1",
                    newValue ? newValue.id : ""
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bank Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={formik.values.chartofAccountId1}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.chartofAccountId1 &&
                      Boolean(formik.errors.chartofAccountId1)
                    }
                    onBlur={formik.handleBlur}
                    helperText={
                      formik.touched.chartofAccountId1 &&
                      (formik.errors.chartofAccountId1 as React.ReactNode)
                    }
                  />
                )}
              />
              <Typography
                style={{ marginTop: "10px", marginBottom: "10px" }}
              ></Typography>

              <Autocomplete
                options={cashOfAccountExpenses}
                getOptionLabel={(option) => option.name}
                value={
                  cashOfAccountExpenses.find(
                    (d: { id: string }) =>
                      d.id === formik.values.chartofAccountId2
                  ) || null
                }
                onChange={(event, newValue) => {
                  formik.setFieldValue(
                    "chartofAccountId2",
                    newValue ? newValue.id : ""
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Expense Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={formik.values.chartofAccountId2}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.chartofAccountId2 &&
                      Boolean(formik.errors.chartofAccountId2)
                    }
                    onBlur={formik.handleBlur}
                    helperText={
                      formik.touched.chartofAccountId2 &&
                      (formik.errors.chartofAccountId2 as React.ReactNode)
                    }
                  />
                )}
              />
              <TextField
                name="date"
                label="Transaction Date"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                value={dayjs(formik.values.date).format("DD/MM/YYYY")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={
                  formik.touched.date && (formik.errors.date as React.ReactNode)
                }
                required
              />
            </div>

            <div>
              <TextField
                name="amount"
                label="Amount"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={formik.handleChange}
                value={formik.values.amount}
                type="number"
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                onBlur={formik.handleBlur}
                helperText={
                  formik.touched.amount &&
                  (formik.errors.amount as React.ReactNode)
                }
                required
              />
              <TextField
                name="transactionRemark"
                label="Transaction Remark"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={formik.handleChange}
                value={formik.values.transactionRemark}
              />
            </div>
          </div>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
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
