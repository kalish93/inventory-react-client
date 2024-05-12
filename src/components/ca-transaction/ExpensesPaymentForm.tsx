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
  Autocomplete,
  Card,
} from "@mui/material";
import { AppDispatch } from "../../app/store";
import { selectTransactions } from "../../features/ca-transaction/transactionSlice";
import { createCATransaction, createExpensesPayment } from "../../features/ca-transaction/transactionActions";
import {
  getCashOfAccounts,
  getCashOfAccountExpenses,
} from "../../features/cash-of-account/cashOfAccountActions";
import { getCustomers } from "../../features/customer/customerActions";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  createBankTransaction,
  getBanks,
} from "../../features/bank/bankActions";
import { useNavigate } from "react-router-dom";

const ExpensesPaymentForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cashOfAccounts = useSelector(
    (state: any) => state.cashOfAccount.cashOfAccounts.items
  );
  const banks = useSelector((state: any) => state.bank.banks.items);
  const cashOfAccountExpenses = useSelector(
    (state: any) => state.cashOfAccount.expenses
  );
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectTransactions);
  const navigate = useNavigate();

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getCashOfAccounts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCashOfAccountExpenses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBanks());
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
      date: "",
      amount: null,
      transactionRemark: "",
      type: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formDataToSend = {
        bankId: values.chartofAccountId1,
        date: values.date,
        remark: values.transactionRemark,
        credit: values.amount,
        debit: values.amount,
        type: "Expense",
        chartofAccountId: values.chartofAccountId2,
        payee: null,
        foreignCurrency: null,
        payment: values.amount,
        deposit: null,
        exchangeRate: null,
      };

      dispatch(createExpensesPayment(formDataToSend));
      setIsFormSubmitted(true);
      formik.resetForm();
      navigate("/ca-transactions");
    },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          padding: "20px",
          maxWidth: "600px",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Typography
            variant="h5"
            component="div"
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            Operation Expenses Payment Form
          </Typography>

          <Autocomplete
            options={banks}
            getOptionLabel={(option) => option.name}
            value={
              banks.find(
                (d: { id: string }) => d.id === formik.values.chartofAccountId1
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
                sx={{ marginBottom: 3 }}
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

          <Autocomplete
            options={cashOfAccountExpenses}
            getOptionLabel={(option) => option.name}
            value={
              cashOfAccountExpenses.find(
                (d: { id: string }) => d.id === formik.values.chartofAccountId2
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
                sx={{ marginBottom: 1}}
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
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={
              formik.touched.date && (formik.errors.date as React.ReactNode)
            }
            required
          />

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
              formik.touched.amount && (formik.errors.amount as React.ReactNode)
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

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Card>
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

export default ExpensesPaymentForm;
