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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { AppDispatch } from "../../app/store";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { selectTransactions } from "../../features/ca-transaction/transactionSlice";
import { createCATransaction } from "../../features/ca-transaction/transactionActions";
import { getCashOfAccounts } from "../../features/cash-of-account/cashOfAccountActions";
import dayjs from "dayjs";
import { getUsers } from "../../features/user/userActions";
import { useFormik } from "formik";
import {
  createBankTransaction,
  getBanks,
} from "../../features/bank/bankActions";
import { date } from "yup";
import { height } from "@mui/system";
import * as yup from "yup";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
}

const JournalEntryForm: React.FC<ProductFormProps> = ({
  open,
  handleClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const cashOfAccounts = useSelector(
    (state: any) => state.cashOfAccount.cashOfAccounts.items
  );
  const banks = useSelector((state: any) => state.bank.banks.items);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { isError, error, loading } = useSelector(selectTransactions);
  const [flag, setFlag] = useState(false);
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getCashOfAccounts());
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
    journalEntryNumber: yup
      .string()
      .required("Journal Entry Number is required"),
    chartofAccountId1: yup.string().required("Chart of Account is required"),
    chartofAccountId2: yup.string().required("Chart of Account is required"),
    date: yup.date().required("Date is required"),
    credit: yup.number().required("Credit is required"),
    debit: yup.number().required("Debit is required"),
  });

  const formik = useFormik({
    initialValues: {
      journalEntryNumber: "",
      chartofAccountId1: "",
      chartofAccountId2: "",
      date: null,
      credit: 0,
      debit: 0,
      transactionRemark: "",
      accountPayableRecievableDetail: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formDataToSend1 = {
        bankId: values.chartofAccountId1,
        date: values.date,
        debit: values.debit,
        credit: null,
        transactionRemark: values.transactionRemark,
        type: "Journal Entry",
        accountPayableRecievableDetail: values.accountPayableRecievableDetail,
      };
      const formDataToSend2 = {
        chartofAccountId: values.chartofAccountId2,
        date: values.date,
        debit: null,
        credit: values.credit,
        transactionRemark: values.transactionRemark,
        type: "Journal Entry",
        accountPayableRecievableDetail: values.accountPayableRecievableDetail,
      };
      const formDataToSend3 = {
        bankId: values.chartofAccountId1,
        type: "Journal Entry",
        deposit: flag ? null : values.debit,
        payment: flag ? values.credit : null,
      };

      console.log(formDataToSend1, formDataToSend2, formDataToSend3);
      dispatch(createCATransaction(formDataToSend1));
      dispatch(createCATransaction(formDataToSend2));
      dispatch(createBankTransaction(formDataToSend3));
      handleClose();
      setIsFormSubmitted(true);
      formik.resetForm();
    },
  });

  const handleCancel = () => {
    handleClose();
    formik.resetForm();
  };

  const handleChange = () => {
    setFlag(!flag);
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Journal Entry Form
            </Typography>
            <div style={{display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                gap:'1rem'
                }}>
            <div
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: "47%",
            }}>
            <TextField
              name="journalEntryNumber"
              label="Journal Entry Number"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              value={formik.values.journalEntryNumber}
              required
              error={
                formik.touched.journalEntryNumber &&
                !formik.values.journalEntryNumber
              }
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.journalEntryNumber &&
                (!formik.values.journalEntryNumber as React.ReactNode)
              }
            />

            <Typography
              style={{ marginTop: "10px", marginBottom: "10px" }}
            ></Typography>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Autocomplete
                style={{ width: "75%" }}
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
                    label="CA Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={formik.values.chartofAccountId1}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.chartofAccountId1 &&
                      !formik.values.chartofAccountId1
                    }
                    onBlur={formik.handleBlur}
                    helperText={
                      formik.touched.chartofAccountId1 &&
                      (!formik.values.chartofAccountId1 as React.ReactNode)
                    }
                  />
                )}
              />
              <FormControl sx={{ m: 1 }} variant="standard">
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={flag ? 2 : 1}
                  onChange={() => handleChange()}
                  input={<BootstrapInput />}
                >
                  <MenuItem value={1}>Debit</MenuItem>
                  <MenuItem value={2}>Credit</MenuItem>
                </Select>
              </FormControl>
            </div>
            <Typography
              style={{ marginTop: "10px", marginBottom: "10px" }}
            ></Typography>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Autocomplete
                style={{ width: "75%" }}
                options={cashOfAccounts}
                getOptionLabel={(option) => option.name}
                value={
                  cashOfAccounts.find(
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
                    label="CA Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={formik.values.chartofAccountId2}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.chartofAccountId2 &&
                      !formik.values.chartofAccountId2
                    }
                    onBlur={formik.handleBlur}
                    helperText={
                      formik.touched.chartofAccountId2 &&
                      (!formik.values.chartofAccountId2 as React.ReactNode)
                    }
                  />
                )}
              />
              <FormControl sx={{ m: 1 }} variant="standard">
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={flag ? 1 : 2}
                  onChange={() => handleChange()}
                  input={<BootstrapInput />}
                >
                  <MenuItem value={1}>Debit</MenuItem>
                  <MenuItem value={2}>Credit</MenuItem>
                </Select>
              </FormControl>
            </div>
            <TextField
              name="transactionRemark"
              label="Transaction Remark"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              value={formik.values.transactionRemark}
              error={
                formik.touched.transactionRemark &&
                !formik.values.transactionRemark
              }
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.transactionRemark &&
                (!formik.values.transactionRemark as React.ReactNode)
              }
            />
            </div>
            <div>
            <TextField
              name="date"
              label="Transaction Date"
              variant="outlined"
              fullWidth
              margin="normal"
              type="date"
              value={dayjs(formik.values.date).format("YYYY-MM-DD")}
              onChange={formik.handleChange}
              error={formik.touched.date && !formik.values.date}
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.date && !formik.values.date && "Date is required"
              }
              required
            />
            <TextField
              name="debit"
              label="Debit"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              value={formik.values.debit}
              required
              error={formik.touched.debit && !formik.values.debit}
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.debit &&
                (!formik.values.debit as React.ReactNode)
              }
            />

            <TextField
              name="credit"
              label="Credit"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              required
              value={formik.values.credit}
              error={formik.touched.credit && !formik.values.credit}
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.credit &&
                (!formik.values.credit as React.ReactNode)
              }
            />

            <TextField
              name="accountPayableRecievableDetail"
              label="Account Receivable/Payable details"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              value={formik.values.accountPayableRecievableDetail}
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

export default JournalEntryForm;
