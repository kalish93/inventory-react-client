// Note: This is a form component for creating custom tax payment transactions
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
  getEslCosts,
} from "../../features/purchase/purchaseActions";
import { getSuppliers } from "../../features/supplier/supplierActions";
import {
  createCustomTaxPayment,
  createDeclaration,
  getDeclarations,
} from "../../features/declaration/declarationAction";

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
}

const CustomTaxPayment: React.FC<ProductFormProps> = ({
  open,
  handleClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const cashOfAccounts = useSelector(
    (state: any) => state.cashOfAccount.cashOfAccounts.items
  );
  const declarations = useSelector(
    (state: any) => state.declaration.declarations.items
  );

  const displayedDeclarations = declarations.filter(
    (declaration: any) => declaration?.declarationProducts?.length !== 0
  );

  const banks = useSelector((state: any) => state.bank.banks.items);
  const suppliers = useSelector((state: any) => state.supplier.suppliers.items);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectTransactions);
  const [selectedDeclaration, setSelectedDeclaration] = useState<any>(null);
  const [amountBefore, setAmountBefore] = useState(0);
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
    dispatch(getDeclarations());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBanks());
  }, [dispatch]);

  const accountsPayable = cashOfAccounts.find(
    (ca: any) => ca.name === "Accounts Payable (A/P) - ETB"
  );

  const customIncomeTaxSupplier = suppliers.find(
    (supplier: any) => supplier.name === "Custom Taxes"
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
    chartofAccountId3: yup.string().required("Declaration number is required"),
    date: yup.string().required("Transaction date is required"),
    amount: yup.number().required("Transaction amount is required"),
  });

  const formik = useFormik({
    initialValues: {
      chartofAccountId1: "",
      chartofAccountId3: "",
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
        supplierId: customIncomeTaxSupplier.id,
        type: "Supplier Payment",
        chartofAccountId: accountsPayable.id,
        number: selectedDeclaration.number,
        paidAmount: values.amount,
        payee: customIncomeTaxSupplier.id,
        payment: values.amount,
        deposit: null,
      };

      dispatch(createCustomTaxPayment(formDataToSend));
      setIsFormSubmitted(true);
      handleClose();
      formik.resetForm();
      dispatch(getDeclarations(1, 10));
    },
  });

  useEffect(() => {
    const currentDeclaration = declarations.find(
      (declaration: any) => declaration.id === formik.values.chartofAccountId3
    );
    setSelectedDeclaration(currentDeclaration);

    const normalDeclaration = declarations.filter(
      (declaration: any) =>
        declaration.id === currentDeclaration?.id &&
        declaration.paidAmount === 0
    );

    const paidDeclaration = declarations.filter(
      (declaration: any) =>
        declaration.number === currentDeclaration?.number &&
        declaration.paidAmount !== 0
    );

    const totalAmount =
      normalDeclaration.length !== 0
        ? normalDeclaration[0].declarationProducts?.reduce(
            (acc: number, declarationProduct: any) =>
              acc + declarationProduct.totalIncomeTax,
            0
          )
        : 0;

    const totalPaid =
      paidDeclaration.length !== 0
        ? paidDeclaration.reduce(
            (acc: number, declaration: any) => acc + declaration.paidAmount,
            0
          )
        : 0;

    setAmountBefore(totalAmount - totalPaid);
  }, [declarations, formik.values.chartofAccountId3]);

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
              Custome Tax Payment Form
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
                  value={customIncomeTaxSupplier?.name}
                />

                <Autocomplete
                  options={displayedDeclarations}
                  getOptionLabel={(option) => option.number}
                  value={
                    declarations.find(
                      (d: { id: string }) =>
                        d.id === formik.values.chartofAccountId3
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    formik.setFieldValue(
                      "chartofAccountId3",
                      newValue ? newValue.id : ""
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Decalration Number"
                      variant="outlined"
                      fullWidth
                      required
                      value={formik.values.chartofAccountId3}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.chartofAccountId3 &&
                        Boolean(formik.errors.chartofAccountId3)
                      }
                      onBlur={formik.handleBlur}
                      helperText={
                        formik.touched.chartofAccountId3 &&
                        (formik.errors.chartofAccountId3 as React.ReactNode)
                      }
                    />
                  )}
                />
              </div>

              <div style={{ maxWidth: "33%" }}>
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
                  Balance Before Payment: {amountBefore.toLocaleString()}
                </Typography>
                <Typography variant="subtitle1" component="div">
                  Balance After Payment:{" "}
                  {(
                    amountBefore - Number(formik.values.amount)
                  ).toLocaleString()}
                </Typography>
              </div>
            </div>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={
                !formik.isValid ||
                formik.isSubmitting ||
                amountBefore - Number(formik.values.amount) < 0
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

export default CustomTaxPayment;
