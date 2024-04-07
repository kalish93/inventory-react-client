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
import {
  getPurchases,
  getTransportCost,
  createTransportCost,
} from "../../features/purchase/purchaseActions";
import { getSuppliers } from "../../features/supplier/supplierActions";

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
}

const TransportExpensePayment: React.FC<ProductFormProps> = ({
  open,
  handleClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const cashOfAccounts = useSelector(
    (state: any) => state.cashOfAccount.cashOfAccounts.items
  );
  const banks = useSelector((state: any) => state.bank.banks.items);
  const purchases = useSelector((state: any) => state.purchase.purchases.items);
  const transports = useSelector(
    (state: any) => state.purchase.transportCosts.items
  );
  const suppliers = useSelector((state: any) => state.supplier.suppliers.items);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectTransactions);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [amountBefore, setAmountBefore] = useState(0);
  const [paidforTransports, setPaidforTransports] = useState<any>([]);
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
    dispatch(getTransportCost());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBanks());
  }, [dispatch]);

  const importTransportCost = cashOfAccounts.find(
    (ca: any) => ca.name === "Import Transport Cost"
  );

  const importTransportDemurrage = cashOfAccounts.find(
    (ca: any) => ca.name === "Import Transport Demurrage"
  );

  const importTransportBakshish = cashOfAccounts.find(
    (ca: any) => ca.name === "Import Transport Bakshish"
  );

  const transportTypes = [
    importTransportBakshish,
    importTransportCost,
    importTransportDemurrage,
  ];

  const accountsPayable = cashOfAccounts.find(
    (ca: any) => ca.name === "Accounts Payable (A/P) - ETB"
  );

  const TransporterSupplier = suppliers.find(
    (supplier: any) => supplier.name === "Transporters"
  );

  const unpaidTransports = transports.filter(
    (transport: any) =>
      transport.paymentStatus === "Incomplete" ||
      transport.paymentStatus === "Partially Complete"
  );

  const paidTransports = transports.filter(
    (transport: any) => transport.paymentStatus === ""
  );

  const realPurchases = purchases.filter(
    (purchase: any) => purchase.paymentStatus !== ""
  );

  unpaidTransports.reverse();
  paidTransports.reverse();

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
      supplierId: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formDataToSend1 = {
        bankId: values.chartofAccountId1,
        date: values.date,
        remark: values.transactionRemark,
        credit: values.amount,
        debit: null,
        supplierId: TransporterSupplier?.id,
        purchaseId: values.chartofAccountId2,
        type: "Supplier Payment",
        transactionRemark: values.transactionRemark,
      };

      const formDataToSend2 = {
        chartofAccountId: accountsPayable?.id,
        date: values.date,
        remark: values.transactionRemark,
        credit: null,
        debit: values.amount,
        supplierId: TransporterSupplier?.id,
        purchaseId: values.chartofAccountId2,
        type: "Supplier Payment",
        transactionRemark: values.transactionRemark,
      };

      const formDataToSend3 = {
        date: values.date,
        transports: paidforTransports,
      };

      const formDataToSend4 = {
        bankId: values.chartofAccountId1,
        payee: values.chartofAccountId2,
        payment: values.amount,
        deposit: null,
        type: "Supplier Payment",
        chartofAccountId: accountsPayable?.id,
      };

      Promise.all([
        dispatch(createCATransaction(formDataToSend1)),
        dispatch(createCATransaction(formDataToSend2)),
        dispatch(createTransportCost(formDataToSend3)),
        dispatch(createBankTransaction(formDataToSend4)),
      ]);
      setIsFormSubmitted(true);
      handleClose();
      formik.resetForm();
      dispatch(getTransportCost(1, 10));
    },
  });

  useEffect(() => {
    const currentPurchase = purchases.find(
      (purchase: any) => purchase?.id === formik.values.chartofAccountId2
    );
    setSelectedPurchase(currentPurchase);

    const currentUnpaidTransports = unpaidTransports.filter(
      (transport: any) =>
        transport.purchase?.id === formik.values.chartofAccountId2
    );

    const currentTransports = transports.filter(
      (transport: any) =>
        transport.purchase.id === formik.values.chartofAccountId2
    );

    const currentPaidTransports = paidTransports.filter(
      (transport: any) =>
        transport.purchase?.id === formik.values.chartofAccountId2
    );

    const totalAmount = currentTransports.reduce(
      (acc: number, transport: any) => acc + transport.cost,
      0
    );

    const totalPaid = currentPaidTransports.reduce(
      (acc: number, transport: any) => acc + transport.paidAmount,
      0
    );

    setAmountBefore(totalAmount - totalPaid);

    let remainingAmount = formik.values.amount as unknown as number;
    let i = 0;
    const updatedPaidforTransports = [];
    console.log(currentUnpaidTransports);
    while (remainingAmount > 0 && i < currentUnpaidTransports.length) {
      const transport = currentUnpaidTransports[i];
      remainingAmount -= transport.cost - Number(transport.paidAmount);

      updatedPaidforTransports.push({
        ...transport,
        paidAmount:
          remainingAmount >= 0
            ? transport.cost - Number(transport.paidAmount)
            : transport.cost - Number(transport.paidAmount) + remainingAmount,
        paymentStatus: remainingAmount >= 0 ? "Complete" : "Partially Complete",
      });
      i++;

      if (remainingAmount <= 0) break; // Exit the loop if remaining amount is <= 0
    }

    setPaidforTransports(updatedPaidforTransports);
  }, [formik.values.chartofAccountId2, formik.values.amount, dispatch]);

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
              Transport Expense Payment Form
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
                        d?.id === formik.values.chartofAccountId1
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    formik.setFieldValue(
                      "chartofAccountId1",
                      newValue ? newValue?.id : ""
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
                  options={realPurchases}
                  getOptionLabel={(option) => option.number.toString()}
                  value={
                    purchases.find(
                      (d: { id: string }) =>
                        d?.id === formik.values.chartofAccountId2
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    formik.setFieldValue(
                      "chartofAccountId2",
                      newValue ? newValue?.id : ""
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Purchase Number"
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
                <Autocomplete
                  options={transportTypes}
                  getOptionLabel={(option) => option.name}
                  value={
                    transportTypes.find(
                      (d: { id: string }) => d?.id === formik.values.supplierId
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    formik.setFieldValue(
                      "supplierId",
                      newValue ? newValue?.id : ""
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Payment Type"
                      variant="outlined"
                      fullWidth
                      required
                      value={formik.values.supplierId}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.supplierId &&
                        Boolean(formik.errors.supplierId)
                      }
                      onBlur={formik.handleBlur}
                      helperText={
                        formik.touched.supplierId &&
                        (formik.errors.supplierId as React.ReactNode)
                      }
                    />
                  )}
                />
              </div>

              <div style={{ maxWidth: "33%" }}>
                <TextField
                style={{ marginTop: "0rem"}}
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

              <div style={{ maxWidth: "33%" }}>
                <Typography variant="subtitle1" component="div">
                  Truck Number: {selectedPurchase?.truckNumber}
                </Typography>
                <Typography variant="subtitle1" component="div">
                  Balance Before: {amountBefore}
                </Typography>
                <Typography variant="subtitle1" component="div">
                  Balance After: {amountBefore - Number(formik.values.amount)}
                </Typography>
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

export default TransportExpensePayment;
