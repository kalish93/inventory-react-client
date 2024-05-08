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
  createJournalEntry,
  getCATransactions,
  getTransactionsByMonth
} from "../../features/ca-transaction/transactionActions";
import { useFormik } from "formik";
import * as yup from "yup";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

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

const MonthlyReallocation: React.FC<ProductFormProps> = ({
  open,
  handleClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const CATransactionState = useSelector(selectTransactions);
  const {
    items: monthlyTransactions = [],
  } = CATransactionState.monthlyTransactions;
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

  const handleDateChange = async (newValue: any) => {
    const month = dayjs(newValue).month() + 1;
    const year = dayjs(newValue).year();

    dispatch(getTransactionsByMonth(month, year));
    let IncomeTaxExpense:number, ESLCustomWarehouse: number, ImportTransportCost: number, TransitFees:number;
    monthlyTransactions.forEach((transaction) => {
      // if (transaction.chartofAccount.name === "Income Tax Expense") {
      // IncomeTaxExpense =+ transaction.debit!;
      // } else if (transaction.chartofAccount.name === "ESL Custom Warehouse") {
      //   ESLCustomWarehouse += transaction.debit!;
      // } else if (transaction.chartofAccount.name === "Import Transport Cost") {
      //   ImportTransportCost += transaction.debit!;
      // } else if (transaction.chartofAccount.name === "Transit Fees") {
      //   TransitFees += transaction.debit!;
      // }
    });

    formik.setFieldValue("currentDate", newValue);
  }

  const validationSchema = yup.object({
    date: yup.date().required("Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      currentDate: null,
      date: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formDataToSend1 = {
        // bankId: values.chartofAccountId1,
        // chartofAccountId: values.chartofAccountId2,
        // date: values.date,
        // debit: values.debit,
        // credit: values.credit,
        // remark: values.transactionRemark,
        // type: "Journal Entry",
        // accountPayableRecievableDetail: values.accountPayableRecievableDetail,
        // deposit: flag ? null : values.debit,
        // payment: flag ? values.credit : null,
      };

      dispatch(createJournalEntry(formDataToSend1));
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
              Journal Entry Form
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
                  value={formik.values.currentDate}
                  onChange={handleDateChange}
                  views={["year", "month"]} 
                  openTo="month" />
                </LocalizationProvider>
              </div>
              <div>
                <TableContainer component={Paper}>
                  <Table sx={{minWidth: 500}} size="small">
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
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provision for Import Taxes</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>ESL Custom Warehouse</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provision for ESL Fees</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Import Transport Cost</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provision for Transport Cost</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Transit fees</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provision for Transit Fees</TableCell>
                        <TableCell></TableCell>
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
