//Note: The ESLPayment component is used to handle ESL warehouse fees payment.
//It is a modal form that is displayed when the user clicks on the ESL warehouse fees payment button.
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
import { useFormik } from "formik";
import * as yup from "yup";
import {
  createBankTransaction,
  getBanks,
} from "../../features/bank/bankActions";

import { getSuppliers } from "../../features/supplier/supplierActions";
import {
  createESLPayment,
  getEslCosts,
  getPurchases,
} from "../../features/purchase/purchaseActions";
import { selectPurchase } from "../../features/purchase/purchaseSlice";

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
}

const ESLPayment: React.FC<ProductFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cashOfAccounts = useSelector(
    (state: any) => state.cashOfAccount.cashOfAccounts.items
  );

  const purchaseState = useSelector(selectPurchase);

  const { items: eslCosts = [] } = purchaseState.eslCosts;
  const banks = useSelector((state: any) => state.bank.banks.items);
  const suppliers = useSelector((state: any) => state.supplier.suppliers.items);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectTransactions);
  const [paidforEsls, setPaidforEsls] = useState<any>([]);
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getCashOfAccounts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getEslCosts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSuppliers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPurchases());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBanks());
  }, [dispatch]);

  const accountsPayable = cashOfAccounts.find(
    (ca: any) => ca.name === "Accounts Payable (A/P) - ETB"
  );

  const eslSupplier = suppliers.find(
    (supplier: any) => supplier.name === "ESL Custom Warehouse"
  );

  const unpaidESL = eslCosts.filter(
    (eslCost) =>
      eslCost.paymentStatus === "Incomplete" ||
      eslCost.paymentStatus === "Partially Complete"
  );

  unpaidESL.reverse();

  useEffect(() => {
    if (isFormSubmitted && !loading) {
      if (isError) {
        showSnackbar(error || "Unknown error", "error");
      } else {
        showSnackbar("Transaction registered successfully.", "success");
      }
      setIsFormSubmitted(false);
    }
    dispatch(getEslCosts(1, 10));
  }, [error, isError, loading, isFormSubmitted]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = yup.object({
    chartofAccountId1: yup.string().required("Bank name is required"),
    date: yup.string().required("Transaction date is required"),
    amount: yup.number().required("Transaction amount is required"),
  });

  const formik = useFormik({
    initialValues: {
      chartofAccountId1: "",
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
        supplierId: eslSupplier.id,
        type: "Supplier Payment",
        transactionRemark: values.transactionRemark,
        chartofAccountId: accountsPayable.id,
        esls: paidforEsls,
        payee: eslSupplier.id,
        payment: values.amount,
        deposit: null,
      };

      dispatch(createESLPayment(formDataToSend));
      setIsFormSubmitted(true);
      handleClose();
      formik.resetForm();
      dispatch(getEslCosts(1, 10));
    },
  });

  useEffect(() => {
    const updatedPaidforEsls = [];
    let remainingAmount = Number(formik.values.amount);

    let i = 0;
    while (remainingAmount > 0 && i < unpaidESL.length) {
      const esl = unpaidESL[i];
      const amountToBePaid = esl.cost - Number(esl.paidAmount);

      if (remainingAmount >= amountToBePaid) {
        // Complete payment for this ESL
        updatedPaidforEsls.push({
          ...esl,
          paidAmount: amountToBePaid,
          paymentStatus: "Complete",
        });
        remainingAmount -= amountToBePaid; // Deduct full amount paid
      } else {
        // Partial payment for this ESL
        updatedPaidforEsls.push({
          ...esl,
          paidAmount: remainingAmount, // Add only the remaining amount
          paymentStatus: "Partially Complete",
        });
        remainingAmount = 0; // No remaining amount left after partial payment
      }

      i++;
    }

    setPaidforEsls(updatedPaidforEsls);
  }, [formik.values.amount, unpaidESL]);

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
            width: 900,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6" component="div">
              ESL Warehouse Fees Payment
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
                  minWidth: "33%",
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

                <TextField
                  label="Supplier"
                  variant="outlined"
                  fullWidth
                  disabled
                  value={eslSupplier?.name}
                />
                <TextField
                  sx={{ marginTop: 0 }}
                  name="transactionRemark"
                  label="Transaction Remark"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={formik.handleChange}
                  value={formik.values.transactionRemark}
                />
              </div>

              <div style={{ maxWidth: "33%" }}>
                <TextField
                  style={{ marginTop: "0rem" }}
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
              </div>

              <div>
                {paidforEsls.map((esl: any) => (
                  <div>
                    <Typography variant="subtitle1" component="div">
                      Purchase Num:{esl.purchase.number}
                    </Typography>
                    <Typography variant="subtitle1" component="div">
                      Track Num:{esl.purchase.truckNumber}
                    </Typography>
                  </div>
                ))}
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

export default ESLPayment;
