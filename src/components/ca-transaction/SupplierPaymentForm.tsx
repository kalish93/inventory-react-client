//Desc: This component is used to create a new supplier payment transaction.
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
import {
  createSupplierPayment,
  getPurchases,
} from "../../features/purchase/purchaseActions";
import { getCashOfAccounts } from "../../features/cash-of-account/cashOfAccountActions";
import { getSuppliers } from "../../features/supplier/supplierActions";
import { useFormik } from "formik";
import * as yup from "yup";
import { getBanks } from "../../features/bank/bankActions";
import { use } from "echarts";

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
  const [paidforPurchases, setPaidforPurchases] = useState<any>([]);
  const [unpaidPurchases, setUnpaidPurchases] = useState<any>(purchases);

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

  const accountsPayableUSD = cashOfAccounts.find(
    (ca: any) => ca.name === "Accounts Payable (A/P) - USD"
  );

  const accountsPayable = cashOfAccounts.find(
    (ca: any) => ca.name === "Accounts Payable (A/P) - ETB"
  );

  // const osmaSupplier = suppliers.find(
  //   (supplier: any) => supplier.name === "OSMA GROUP FZE"
  // );

  const validationSchema = yup.object({
    chartofAccountId1: yup.string().required("Bank name is required"),
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
      exchangeRate: null,
      type: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formDataToSend = {
        bankId: values.chartofAccountId1,
        date: values.date,
        remark: values.transactionRemark,
        credit: values.exchangeRate
          ? values.amount! * values.exchangeRate
          : values.amount,
        debit: values.exchangeRate
          ? values.amount! * values.exchangeRate
          : values.amount,
        supplierId: values.chartofAccountId2,
        type: "Supplier Payment",
        chartofAccountId: values.exchangeRate
          ? accountsPayableUSD.id
          : accountsPayable.id,
        exchangeRate: values.exchangeRate,
        USDAmount: values.amount,
        purchases: paidforPurchases,
        payee: values.chartofAccountId2,
        foreignCurrency: values.exchangeRate ? -values.amount! : null,
        payment: values.exchangeRate
          ? values.amount! * values.exchangeRate
          : values.amount,
        deposit: null,
      };

      await dispatch(createSupplierPayment(formDataToSend));
      setIsFormSubmitted(true);
      handleClose();
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (isFormSubmitted && !loading) {
      if (isError) {
        showSnackbar(error || "Unknown error", "error");
      } else {
        showSnackbar("Supplier payment created successfully.", "success");
      }
      setIsFormSubmitted(false);
    }
  }, [error, isError, loading, isFormSubmitted]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const filteredPurchases = purchases.filter(
      (purchase: any) =>
        purchase.paymentStatus === "Incomplete" ||
        (purchase.paymentStatus === "Partially Complete" &&
          purchase.supplier.id === formik.values.chartofAccountId2)
    );
    filteredPurchases.reverse();
    setUnpaidPurchases(filteredPurchases);
  }, [purchases, formik.values.chartofAccountId2]);
  const handleCancel = () => {
    handleClose();
    formik.resetForm();
  };

  useEffect(() => {
    const updatedPaidforPurchases = [];
    let remainingAmount = Number(formik.values.amount);
    const exchangeRate = formik.values.exchangeRate;

    if (exchangeRate !== null) {
      let i = 0;
      while (remainingAmount > 0 && i < unpaidPurchases.length) {
        const purchase = unpaidPurchases[i];
        let totalAmount = purchase.products.reduce(
          (
            acc: number,
            productPurchase: {
              purchaseUnitPriceUSD: number;
              purchaseQuantity: number;
            }
          ) =>
            acc +
            productPurchase.purchaseUnitPriceUSD *
              productPurchase.purchaseQuantity,
          0
        );

        const amountPaidAlreadyUSD = Number(purchase.paidAmountUSD);
        const amountPaidAlreadyETB = Number(purchase.paidAmountETB);
        const amountToBePaid = totalAmount - amountPaidAlreadyUSD;

        let paidUSD = 0,
          paidETB = 0,
          paymentStatus = "Partially Complete";

        if (remainingAmount >= amountToBePaid) {
          paidUSD = amountToBePaid;
          paidETB = amountToBePaid * exchangeRate;
          remainingAmount -= amountToBePaid;
          paymentStatus = "Complete";
        } else {
          paidUSD = remainingAmount;
          paidETB = remainingAmount * exchangeRate;
          remainingAmount = 0;
        }

        updatedPaidforPurchases.push({
          ...purchase,
          paidAmountUSD: paidUSD,
          paidAmountETB: paidETB,
          paymentStatus: paymentStatus,
        });

        i++;
      }
    } else {
      let i = 0;
      while (remainingAmount > 0 && i < unpaidPurchases.length) {
        const purchase = unpaidPurchases[i];
        let totalAmount = purchase.products.reduce(
          (
            acc: number,
            productPurchase: {
              purchaseUnitPriceETB: number;
              purchaseQuantity: number;
            }
          ) =>
            acc +
            productPurchase.purchaseUnitPriceETB *
              productPurchase.purchaseQuantity,
          0
        );

        const amountPaidAlreadyETB = Number(purchase.paidAmountETB);
        const amountToBePaid = totalAmount - amountPaidAlreadyETB;

        let paidETB = 0,
          paymentStatus = "Partially Complete";

        if (remainingAmount >= amountToBePaid) {
          paidETB = amountToBePaid;
          remainingAmount -= amountToBePaid;
          paymentStatus = "Complete";
        } else {
          paidETB = remainingAmount;
          remainingAmount = 0;
        }

        updatedPaidforPurchases.push({
          ...purchase,
          paidAmountUSD: 0,
          paidAmountETB: amountPaidAlreadyETB + paidETB,
          paymentStatus: paymentStatus,
        });

        i++;
      }
    }

    setPaidforPurchases(updatedPaidforPurchases);
  }, [formik.values.amount, formik.values.exchangeRate, unpaidPurchases]);

  const selectedSupplier = suppliers.find(
    (s: any) => s.id === formik.values.chartofAccountId2
  );
  const supplierCurrency = selectedSupplier ? selectedSupplier.currency : "";

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
                      sx={{ marginBottom: 1 }}
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
                      sx={{ marginBottom: 1 }}
                      label="Supplier"
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
                  sx={{ marginTop: 0 }}
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
                  style={{ marginTop: "0" }}
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
                {supplierCurrency === "USD" && (
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
                  />
                )}
                <TextField
                  name="transactionRemark"
                  label="Transaction Remark"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={formik.handleChange}
                  value={formik.values.transactionRemark}
                />
                <Typography style={{ marginTop: "1rem" }}></Typography>
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
