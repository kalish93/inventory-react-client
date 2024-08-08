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
  createMonthlyJournalEntry,
  getCATransactions,
} from "../../features/ca-transaction/transactionActions";
import { useFormik } from "formik";
import * as yup from "yup";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { selectProvision } from "../../features/provision/provisionSlice";
import { getMonthlyProvisions } from "../../features/provision/provisionActions";

interface ProductFormProps {
  open: boolean;
  handleClose: () => void;
}

const MonthlyVentillation: React.FC<ProductFormProps> = ({
  open,
  handleClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const cashOfAccounts = useSelector(
    (state: any) => state.cashOfAccount.cashOfAccounts.items
  );
  const provisionState = useSelector(selectProvision);
  const { items: monthlyProvisions = [] } = provisionState.monthlyProvisions;

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
    if (
      month !== null &&
      year !== null &&
      Number.isFinite(month) &&
      Number.isFinite(year)
    ) {
      dispatch(getMonthlyProvisions(month, year));
    }
  }, [dispatch, currentDate]);

  useEffect(() => {
    let incomeTaxExpenseTotal = 0;
    let eslCustomWarehouseFeeTotal = 0;
    let importTransportCostTotal = 0;
    let transitFeesTotal = 0;

    monthlyProvisions.forEach((provision: any) => {
      incomeTaxExpenseTotal +=
        provision.productDeclaration?.unitIncomeTax *
        provision.saleDetail?.saleQuantity;
      eslCustomWarehouseFeeTotal +=
        provision.saleDetail.productPurchase.esl.unitEslCost *
          provision.saleDetail?.saleQuantity;
      importTransportCostTotal +=
        provision.saleDetail?.productPurchase?.transport?.unitTransportCost *
        provision.saleDetail?.saleQuantity;
      transitFeesTotal +=
        provision.saleDetail?.productPurchase?.transit?.unitTransitCost *
        provision.saleDetail?.saleQuantity;
    });

    // Update state with accumulated values
    setIncomeTaxExpense(incomeTaxExpenseTotal);
    setESLCustomWarehouseFee(eslCustomWarehouseFeeTotal);
    setImportTransportCost(importTransportCostTotal);
    setTransitFees(transitFeesTotal);
  }, [monthlyProvisions]); // Only run this effect when monthlyProvisions changes

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const incomeTaxExpense = cashOfAccounts.find(
    (ca: any) => ca.name === "Income tax expense"
  );
  const provisionIncomeTaxExpense = cashOfAccounts.find(
    (ca: any) => ca.name === "Provision for Import Taxes"
  );
  const eSLCustomWarehouse = cashOfAccounts.find(
    (ca: any) => ca.name === "ESL Cost"
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
      remark: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formDataToSend1 = {
        chartofAccountId1: incomeTaxExpense.id,
        chartofAccountId2: provisionIncomeTaxExpense.id,
        chartofAccountId3: eSLCustomWarehouse.id,
        chartofAccountId4: provisionESLCustomWarehouse.id,
        chartofAccountId5: importTransportCost.id,
        chartofAccountId6: provisionImportTransportCost.id,
        chartofAccountId7: transitFees.id,
        chartofAccountId8: provisionTransitFees.id,
        date: values.date,
        amount1: IncomeTaxExpense,
        amount2: ESLCustomWarehouseFee,
        amount3: ImportTransportCost,
        amount4: TransitFees,
        type: "Journal Entry",
        remark: values.remark,
      };

      await dispatch(createMonthlyJournalEntry(formDataToSend1));
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
              Provison Monthly Ventilation as per Sales
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
                <TextField
                  name="remark"
                  label="Transaction Remark"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  sx={{ marginBottom: 2 }}
                  value={formik.values.remark}
                  onChange={formik.handleChange}
                  error={formik.touched.remark && !formik.values.remark}
                  onBlur={formik.handleBlur}
                />
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
                        <TableCell>
                          {IncomeTaxExpense.toLocaleString()}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provision for Import Taxes</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          {IncomeTaxExpense.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>ESL Cost</TableCell>
                        <TableCell>
                          {ESLCustomWarehouseFee.toLocaleString()}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provision for ESL Fees</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          {ESLCustomWarehouseFee.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Import Transport Cost</TableCell>
                        <TableCell>
                          {ImportTransportCost.toLocaleString()}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provision for Transport Cost</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          {ImportTransportCost.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Transit fees</TableCell>
                        <TableCell>{TransitFees.toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provision for Transit Fees</TableCell>
                        <TableCell></TableCell>
                        <TableCell>{TransitFees.toLocaleString()}</TableCell>
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

export default MonthlyVentillation;
