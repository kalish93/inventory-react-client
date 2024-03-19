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
import {
  createSupplierPayment,
  getPurchases,
} from "../../features/purchase/purchaseActions";
import { getCashOfAccounts } from "../../features/cash-of-account/cashOfAccountActions";
import { getSuppliers } from "../../features/supplier/supplierActions";
import { getCustomers } from "../../features/customer/customerActions";
import { useFormik } from "formik";
import * as yup from "yup";
import { getBanks } from "../../features/bank/bankActions";

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
}

const SupplierPaymentForm: React.FC<ProductFormProps> = ({
  open,
  handleClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const cashOfAccounts = useSelector(
    (state: any) => state.cashOfAccount.cashOfAccounts.items
  );
  const banks = useSelector((state: any) => state.bank.banks.items);
  const purchases = useSelector((state: any) => state.purchase.purchases.items);
  const suppliers = useSelector((state: any) => state.supplier.suppliers.items);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectTransactions);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getCashOfAccounts());
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

  const foringnCurrencySupplier = suppliers.filter(
    (supplier: any) => supplier.currency === "USD"
  );

  const accountsPayableUSD = cashOfAccounts.find(
    (ca: any) => ca.name === "Accounts Payable (A/P) - USD"
  );

  const accountsPayable = cashOfAccounts.find(
    (ca: any) => ca.name === "Accounts Payable (A/P) - ETB"
  );

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
      amount: undefined,
      transactionRemark: "",
      exchangeRate: undefined,
      type: "",
      purchaseId: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formDataToSend1 = {
        bankId: values.chartofAccountId1,
        date: values.date,
        remark: values.transactionRemark,
        credit: null,
        debit: values.exchangeRate
          ? values.amount! * values.exchangeRate
          : values.amount,
        supplierId: values.chartofAccountId2,
        purchaseId: values.purchaseId,
        type: "Supplier Payment",
      };

      const formDataToSend2 = {
        chartofAccountId: values.exchangeRate
          ? accountsPayableUSD.id
          : accountsPayable.id,
        date: values.date,
        remark: values.transactionRemark,
        exchangeRate: values.exchangeRate,
        credit: values.exchangeRate
          ? values.amount! * values.exchangeRate
          : values.amount,
        debit: null,
        supplierId: values.chartofAccountId2,
        type: "Supplier Payment",
        purchaseId: values.purchaseId,
        USDAmount: values.amount,
      };

      const formDataToSend3 = {
        date: values.date,
        number: values.purchaseId,
        supplierId: values.chartofAccountId2,
        exchangeRate: values.exchangeRate,
        paidAmountUSD: values.exchangeRate ? values.amount : null,
        padiAmountETB: values.exchangeRate
          ? values.amount! * values.exchangeRate
          : values.amount,
      };
      Promise.all([
        dispatch(createCATransaction(formDataToSend1)),
        dispatch(createCATransaction(formDataToSend2)),
        dispatch(createSupplierPayment(formDataToSend3)),
      ]);
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
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6" component="div">
              Supplier Payment Form
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
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
                  options={suppliers}
                  getOptionLabel={(option) => option.name}
                  value={
                    suppliers.find(
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
                      label="Supplier Name"
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
                    formik.touched.date &&
                    (formik.errors.date as React.ReactNode)
                  }
                  required
                />
              </div>

              <div style={{ maxWidth: "47%" }}>
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

                {
                  //check if the supplier is in foreign currency by checking chartofAccountId2 in the foreignCurrencySupplier list

                  foringnCurrencySupplier.find(
                    (supplier: any) =>
                      supplier.id === formik.values.chartofAccountId2
                  ) ? (
                    <>
                      <TextField
                        name="exchangeRate"
                        label="Exchange Rate"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={formik.handleChange}
                        value={formik.values.exchangeRate}
                        type="number"
                        error={
                          formik.touched.exchangeRate &&
                          Boolean(formik.errors.exchangeRate)
                        }
                        onBlur={formik.handleBlur}
                        helperText={
                          formik.touched.exchangeRate &&
                          (formik.errors.exchangeRate as React.ReactNode)
                        }
                        required
                      />
                      <Typography style={{ marginTop: "1rem" }}></Typography>
                      <Autocomplete
                        options={purchases}
                        getOptionLabel={(option) => option.number.toString()}
                        value={
                          purchases.find(
                            (d: { id: string }) =>
                              d.id === formik.values.purchaseId
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          formik.setFieldValue(
                            "purchaseId",
                            newValue ? newValue.id : ""
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Purchase Number"
                            variant="outlined"
                            fullWidth
                            required
                            value={formik.values.purchaseId}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.purchaseId &&
                              Boolean(formik.errors.purchaseId)
                            }
                            onBlur={formik.handleBlur}
                            helperText={
                              formik.touched.purchaseId &&
                              (formik.errors.purchaseId as React.ReactNode)
                            }
                          />
                        )}
                      />
                    </>
                  ) : null
                }
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

export default SupplierPaymentForm;
