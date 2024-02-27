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

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  formLabel: string;
}

const CATransactionsForm: React.FC<ProductFormProps> = ({
  open,
  handleClose,
  title,
  formLabel,
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

  console.log(customers);
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
    chartofAccountId1: "",
    chartofAccountId2: "",
    date: null,
    amount: 0,
    transactionRemark: "",
  });
  const [touched, setTouched] = useState<{
    chartofAccountId1?: boolean;
    chartofAccountId2?: boolean;
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
    let newFormData = {
      chartofAccountId1: formData.chartofAccountId1,
      chartofAccountId2: formData.chartofAccountId2,
      date: formData.date,
      remark: formData.transactionRemark,
      credit: "",
      debit: "",
      purchaseId: ""
    };
    if (title === "Add Expense") {
      newFormData.credit = formData.amount.toString();
    } else if (title === "Add Supplier Payment") {
      newFormData.chartofAccountId2 = "9145a724-1650-4416-bbcf-f1e1ac3619e5";
      newFormData.debit = formData.amount.toString();
    } else if (title === "Add Customer Payment") {
      const customer = customers.find(
        (customer: { id: string }) => customer.id === formData.chartofAccountId2
      );
      newFormData.chartofAccountId2 = "6e57436a-8c19-426a-a260-f8fc5e6de0e1";
      newFormData.remark = `Payment made by ${customer.firstName} for ${formData.transactionRemark}`;
      newFormData.debit = formData.amount.toString();
    } else if (title === "Add Transport Payment") {
      newFormData.purchaseId = formData.chartofAccountId2;
      newFormData.chartofAccountId2 = "3f2d5f0e-7ac4-4fd4-b4b6-bf7ae1f05f4c";
      newFormData.debit = formData.amount.toString();

    }
    console.log(newFormData);
    dispatch(createCATransaction(newFormData));
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
          <Autocomplete
            options={cashOfAccountBanks}
            getOptionLabel={(option) => option.name}
            value={
              cashOfAccountBanks.find(
                (d: { id: string }) => d.id === formData.chartofAccountId1
              ) || null
            }
            onChange={(event, newValue) => {
              handleChange({
                target: {
                  name: "chartofAccountId1",
                  value: newValue ? newValue.id : "",
                },
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Bank Name"
                variant="outlined"
                fullWidth
                required
                error={touched.chartofAccountId1 && !formData.chartofAccountId1}
                onBlur={() =>
                  setTouched({ ...touched, chartofAccountId1: true })
                }
              />
            )}
          />
          {formLabel === "CA Full Name" ? (
            <>
              <Typography
                style={{ marginTop: "10px", marginBottom: "10px" }}
              ></Typography>

              <Autocomplete
                options={cashOfAccountExpenses}
                getOptionLabel={(option) => option.name}
                value={
                  cashOfAccountExpenses.find(
                    (d: { id: string }) => d.id === formData.chartofAccountId2
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "chartofAccountId2",
                      value: newValue ? newValue.id : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Expense Name"
                    variant="outlined"
                    fullWidth
                    required
                    error={
                      touched.chartofAccountId2 && !formData.chartofAccountId2
                    }
                    onBlur={() =>
                      setTouched({ ...touched, chartofAccountId2: true })
                    }
                  />
                )}
              />
            </>
          ) : formLabel === "Supplier Name" ? (
            <>
              <Typography
                style={{ marginTop: "10px", marginBottom: "10px" }}
              ></Typography>

              <Autocomplete
                options={suppliers}
                getOptionLabel={(option) => option.name}
                value={
                  suppliers.find(
                    (d: { id: string }) => d.id === formData.chartofAccountId2
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "chartofAccountId2",
                      value: newValue ? newValue.id : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Supplier Name"
                    variant="outlined"
                    fullWidth
                    required
                    error={
                      touched.chartofAccountId2 && !formData.chartofAccountId2
                    }
                    onBlur={() =>
                      setTouched({ ...touched, chartofAccountId2: true })
                    }
                  />
                )}
              />
            </>
          ) : formLabel === "Customer Name" ? (
            <>
              <Typography
                style={{ marginTop: "10px", marginBottom: "10px" }}
              ></Typography>
              <Autocomplete
                options={customers}
                getOptionLabel={(option) => option.firstName}
                value={
                  customers.find(
                    (d: { id: string }) => d.id === formData.chartofAccountId2
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "chartofAccountId2",
                      value: newValue ? newValue.id : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer"
                    variant="outlined"
                    fullWidth
                    required
                    error={
                      touched.chartofAccountId2 && !formData.chartofAccountId2
                    }
                    onBlur={() =>
                      setTouched({ ...touched, chartofAccountId2: true })
                    }
                  />
                )}
              />
            </>
          ) : (
            <TextField
              name="chartofAccountId2"
              label={formLabel}
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
              error={touched.chartofAccountId2 && !formData.chartofAccountId2}
              onBlur={() => handleBlur("chartofAccountId2")}
            />
          )}
          {touched.chartofAccountId2 && !formData.chartofAccountId2 && (
            <FormHelperText error>{formLabel} is required</FormHelperText>
          )}
          <TextField
            name="date"
            label="Transaction Date"
            variant="outlined"
            fullWidth
            margin="normal"
            type="date"
            value={dayjs(formData.date).format("YYYY-MM-DD")}
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
            error={touched.amount && !formData.amount}
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
              !formData.chartofAccountId1 ||
              !formData.amount ||
              !formData.chartofAccountId2 ||
              !formData.date
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
