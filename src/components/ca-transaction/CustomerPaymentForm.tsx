// Desc: This file contains the form for creating a customer payment transaction.
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
} from "@mui/material";
import { AppDispatch } from "../../app/store";
import { selectTransactions } from "../../features/ca-transaction/transactionSlice";
import { createCATransaction } from "../../features/ca-transaction/transactionActions";
import { getCashOfAccounts } from "../../features/cash-of-account/cashOfAccountActions";
import { getCustomers } from "../../features/customer/customerActions";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  createBankTransaction,
  getBanks,
} from "../../features/bank/bankActions";
import {
  createCustomerPayment,
  getSales,
} from "../../features/sales/salesActions";

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
}

const CustomerPaymentForm: React.FC<ProductFormProps> = ({
  open,
  handleClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const cashOfAccounts = useSelector(
    (state: any) => state.cashOfAccount.cashOfAccounts.items
  );
  const banks = useSelector((state: any) => state.bank.banks.items);
  const customers = useSelector((state: any) => state.customer.customers.items);
  const sales = useSelector((state: any) => state.sale.sales.items);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectTransactions);
  const [paidforSales, setPaidforSales] = useState<any>([]);
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getCashOfAccounts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSales());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBanks());
  }, [dispatch]);

  const accountReceivable = cashOfAccounts.find(
    (ca: any) => ca.name === "Accounts Receivable (A/R)"
  );

  const unpaidSales = sales.filter(
    (sale: any) =>
      sale.paymentStatus === "Incomplete" ||
      sale.paymentStatus === "Partially Complete"
  );

  unpaidSales.reverse();

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
    onSubmit: async (values) => {
      const formDataToSend = {
        bankId: values.chartofAccountId1,
        date: values.date,
        remark: values.transactionRemark,
        credit: values.amount,
        debit: values.amount,
        customerId: values.chartofAccountId2,
        type: "Customer Payment",
        chartofAccountId: accountReceivable.id,
        payee: values.chartofAccountId2,
        foreignCurrency: null,
        payment: null,
        deposit: values.amount,
        exchangeRate: null,
        sales: paidforSales,
      };

      await dispatch(createCustomerPayment(formDataToSend));
      setIsFormSubmitted(true);
      handleClose();
      formik.resetForm();
    },
  });

  useEffect(() => {
    const updatedPaidforSales = [];
    const customerUnpaidSales = unpaidSales.filter(
      (sale: any) => sale.customer.id === formik.values.chartofAccountId2
    );
    let remainingAmount = Number(formik.values.amount);

    let i = 0;
    while (remainingAmount > 0 && i < customerUnpaidSales.length) {
      const sale = customerUnpaidSales[i];
      let totalAmount = 0;
      for (let productsale of sale.sales) {
        totalAmount += productsale.totalSales;
      }

      const amountToBePaid = totalAmount - Number(sale.paidAmount);
      let paidAmount = 0;

      if (remainingAmount >= amountToBePaid) {
        paidAmount = amountToBePaid;
        remainingAmount -= amountToBePaid; // Deduct full amount paid
      } else {
        paidAmount = remainingAmount;
        remainingAmount = 0; // No remaining amount left after partial payment
      }
      updatedPaidforSales.push({
        ...sale,
        paidAmount: paidAmount,
        paymentStatus: "Complete",
      });

      i++;
    }

    setPaidforSales(updatedPaidforSales);
  }, [formik.values.amount, formik.values.chartofAccountId2, dispatch]);

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
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6" component="div">
              Customer Payment Form
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  minWidth: "47%",
                }}
              >
                <Autocomplete
                  options={banks}
                  getOptionLabel={(option) => option.name}
                  value={
                    banks.find(
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

                <Autocomplete
                  options={customers}
                  getOptionLabel={(option) =>
                    option.firstName + " " + option.lastName
                  }
                  value={
                    customers.find(
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
                      label="Customer Name"
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
                  sx={{ marginTop: 0 }}
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
                    formik.touched.date &&
                    (formik.errors.date as React.ReactNode)
                  }
                  required
                />
              </div>

              <div style={{ maxWidth: "47%" }}>
                <TextField
                  sx={{ marginTop: 0 }}
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

export default CustomerPaymentForm;
