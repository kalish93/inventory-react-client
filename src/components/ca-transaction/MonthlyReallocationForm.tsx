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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Tab,
} from "@mui/material";
import { AppDispatch } from "../../app/store";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { selectTransactions } from "../../features/ca-transaction/transactionSlice";
import {
  createCATransaction,
  createJournalEntry,
  getCATransactions,
  getTransactionsByMonth,
} from "../../features/ca-transaction/transactionActions";
import { useFormik } from "formik";
import * as yup from "yup";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
}

const MonthlyReallocation: React.FC<ProductFormProps> = ({
  open,
  handleClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const cashOfAccounts = useSelector(
    (state: any) => state.cashOfAccount.cashOfAccounts.items
  );
  const CATransactionState = useSelector(selectTransactions);
  const { items: monthlyTransactions = [] } =
    CATransactionState.monthlyTransactions;
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentDate, setCurrentDate] = useState(null);
  const [IncomeTaxExpense, setIncomeTaxExpense] = useState(0);
  const [ESLCustomWarehouseFee, setESLCustomWarehouseFee] = useState(0);
  const [ImportTransportCost, setImportTransportCost] = useState(0);
  const [TransitFees, setTransitFees] = useState(0);
  const { isError, error, loading } = useSelector(selectTransactions);
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

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

  useEffect(() => {
    // Fetch transactions for the selected month and year
    const month = dayjs(currentDate).month() + 1;
    const year = dayjs(currentDate).year();
    dispatch(getTransactionsByMonth(month, year));
  }, [currentDate, dispatch]);

  useEffect(() => {

    let incomeTaxExpenseTotal = 0;
    let eslCustomWarehouseFeeTotal = 0;
    let importTransportCostTotal = 0;
    let transitFeesTotal = 0;

    monthlyTransactions.forEach((transaction) => {
      if (transaction.type === "Journal Entry") {
        return;
      } else if (transaction.chartofAccountId === incomeTaxExpense?.id) {
        incomeTaxExpenseTotal += transaction.debit ?? 0;
      } else if (transaction.chartofAccountId === eSLCustomWarehouse?.id) {
        eslCustomWarehouseFeeTotal += transaction.debit ?? 0;
      } else if (transaction.chartofAccountId === importTransportCost?.id) {
        importTransportCostTotal += transaction.debit ?? 0;
      } else if (transaction.chartofAccountId === transitFees?.id) {
        transitFeesTotal += transaction.debit ?? 0;
      }
    });

    // Update state with accumulated values
    setIncomeTaxExpense(incomeTaxExpenseTotal);
    setESLCustomWarehouseFee(eslCustomWarehouseFeeTotal);
    setImportTransportCost(importTransportCostTotal);
    setTransitFees(transitFeesTotal);
  }, [dispatch, monthlyTransactions]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const incomeTaxExpense = cashOfAccounts.find(
    (ca: any) => ca.name === "Income tax expense"
  );
  const provisionIncomeTaxExpense = cashOfAccounts.find(
  (ca: any) => ca.name === "Provision for Import Taxes"
  )
  const eSLCustomWarehouse = cashOfAccounts.find(
    (ca: any) => ca.name === "ESL Custom Warehouse"
  );
  const provisionESLCustomWarehouse = cashOfAccounts.find(
    (ca: any) => ca.name === "Provision for ESL Fees"
  );
  const importTransportCost = cashOfAccounts.find(
    (ca: any) => ca.name === "Import Transport Cost"
  );
  const provisionImportTransportCost = cashOfAccounts.find(
    (ca: any) => ca.name === "Provision for Transport Fees"
  );
  const transitFees = cashOfAccounts.find(
    (ca: any) => ca.name === "Transit fees"
  );
  const provisionTransitFees = cashOfAccounts.find(
    (ca: any) => ca.name === "Provision for Transit Fees"
  );

  const validationSchema = yup.object({
    date: yup.date().required("Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      date: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formDataToSend1 = {
        chartofAccountId: incomeTaxExpense?.id,
        date: values.date,
        debit: null,
        credit: IncomeTaxExpense,
        type: "Journal Entry",
      };
      const formDataToSend2 = {
        chartofAccountId: provisionIncomeTaxExpense?.id,
        date: values.date,
        debit: IncomeTaxExpense,
        credit: null,
        type: "Journal Entry",
      };
      const formDataToSend3 = {
        chartofAccountId: eSLCustomWarehouse?.id,
        date: values.date,
        debit: null,
        credit: ESLCustomWarehouseFee,
        type: "Journal Entry",
      };
      const formDataToSend4 = {
        chartofAccountId: provisionESLCustomWarehouse?.id,
        date: values.date,
        debit: ESLCustomWarehouseFee,
        credit: null,
        type: "Journal Entry",
      };
      const formDataToSend5 = {
        chartofAccountId: importTransportCost?.id,
        date: values.date,
        debit: null,
        credit: ImportTransportCost,
        type: "Journal Entry",
      };
      const formDataToSend6 = {
        chartofAccountId: provisionImportTransportCost?.id,
        date: values.date,
        debit: ImportTransportCost,
        credit: null,
        type: "Journal Entry",
      };
      const formDataToSend7 = {
        chartofAccountId: transitFees?.id,
        date: values.date,
        debit: null,
        credit: TransitFees,
        type: "Journal Entry",
      };
      const formDataToSend8 = {
        chartofAccountId: provisionTransitFees?.id,
        date: values.date,
        debit: TransitFees,
        credit: null,
        type: "Journal Entry",
      };


      Promise.all([
        dispatch(createCATransaction(formDataToSend1)),
        dispatch(createCATransaction(formDataToSend2)),
        dispatch(createCATransaction(formDataToSend3)),
        dispatch(createCATransaction(formDataToSend4)),
        dispatch(createCATransaction(formDataToSend5)),
        dispatch(createCATransaction(formDataToSend6)),
        dispatch(createCATransaction(formDataToSend7)),
        dispatch(createCATransaction(formDataToSend8)),        
      ])
      handleClose();
      setIsFormSubmitted(true);
      formik.resetForm();
      dispatch(getCATransactions(1, 10));
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
            maxHeight: "85vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Provison Monthly Re-allaocation
            </Typography>
            <div
              style={{
                display: "flex",
                marginLeft: "20px",
                marginRight: "20px",
                marginTop: "10px",
                marginBottom: "20px",
                gap: "3rem",
              }}
            >
              <div>
                <TextField
                  name="date"
                  label="Journal Entry Date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  error={formik.touched.date && !formik.values.date}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.date &&
                    !formik.values.date &&
                    "Date is required"
                  }
                  required
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={currentDate}
                    onChange={(newValue) => setCurrentDate(newValue)}
                    views={["year", "month"]}
                    openTo="month"
                  />
                </LocalizationProvider>
              </div>
              <div>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 500 }} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>CA Fullname</TableCell>
                        <TableCell>Debit</TableCell>
                        <TableCell>Credit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Income Tax Expense</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          {IncomeTaxExpense.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provision for Import Taxes</TableCell>
                        <TableCell>
                          {IncomeTaxExpense.toLocaleString()}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>ESL Custom Warehouse</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          {ESLCustomWarehouseFee.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provision for ESL Fees</TableCell>
                        <TableCell>
                          {ESLCustomWarehouseFee.toLocaleString()}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Import Transport Cost</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          {ImportTransportCost.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provision for Transport Cost</TableCell>
                        <TableCell>
                          {ImportTransportCost.toLocaleString()}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Transit fees</TableCell>
                        <TableCell></TableCell>
                        <TableCell>{TransitFees.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provision for Transit Fees</TableCell>
                        <TableCell>{TransitFees.toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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

export default MonthlyReallocation;
