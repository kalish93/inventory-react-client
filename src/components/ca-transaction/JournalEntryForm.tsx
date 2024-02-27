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
import { getCashOfAccounts } from "../../features/cash-of-account/cashOfAccountActions";
import dayjs from "dayjs";
import { getUsers } from "../../features/user/userActions";

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
  const users = useSelector((state: any) => state.user.users.items);
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
    dispatch(getUsers());
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

  const [formData, setFormData] = useState({
    journalKeeper: "",
    chartofAccountId1: "",
    chartofAccountId2: "",
    date: null,
    credit: 0,
    debit: 0,
    transactionRemark: "",
  });
  const [touched, setTouched] = useState<{
    journalKeeper?: boolean;
    chartofAccountId1?: boolean;
    chartofAccountId2?: boolean;
    date?: boolean;
    credit?: boolean;
    debit?: boolean;
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
      credit: formData.credit,
      debit: formData.debit,
    };

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
            Journal Entry Form
          </Typography>
          <>
            <Typography
              style={{ marginTop: "10px", marginBottom: "10px" }}
            ></Typography>
            <Autocomplete
              options={users}
              getOptionLabel={(option) => option.userName}
              value={
                users.find(
                  (d: { id: string }) => d.id === formData.journalKeeper
                ) || null
              }
              onChange={(event, newValue) => {
                handleChange({
                  target: {
                    name: "journalKeeper",
                    value: newValue ? newValue.id : "",
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Journal Keeper"
                  variant="outlined"
                  fullWidth
                  required
                  error={touched.journalKeeper && !formData.journalKeeper}
                  onBlur={() => setTouched({ ...touched, journalKeeper: true })}
                />
              )}
            />
          </>
          {touched.journalKeeper && !formData.journalKeeper && (
            <FormHelperText error>Journal Keeper is required</FormHelperText>
          )}
          <Typography
            style={{ marginTop: "10px", marginBottom: "10px" }}
          ></Typography>
          <Autocomplete
            options={cashOfAccounts}
            getOptionLabel={(option) => option.name}
            value={
              cashOfAccounts.find(
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
                label="CA Name (Debit)"
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
          {touched.chartofAccountId1 && !formData.chartofAccountId1 && (
            <FormHelperText error>CA Name is required</FormHelperText>
          )}
          <>
            <Typography
              style={{ marginTop: "10px", marginBottom: "10px" }}
            ></Typography>

            <Autocomplete
              options={cashOfAccounts}
              getOptionLabel={(option) => option.name}
              value={
                cashOfAccounts.find(
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
                  label="CA Name (Credit)"
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
          {touched.chartofAccountId2 && !formData.chartofAccountId2 && (
            <FormHelperText error>CA Name is required</FormHelperText>
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
            name="debit"
            label="Debit"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
            error={touched.debit && !formData.debit}
            onBlur={() => handleBlur("debit")}
          />
          {touched.debit && !formData.debit && (
            <FormHelperText error>
              Transaction amount is required
            </FormHelperText>
          )}
          <TextField
            name="credit"
            label="Credit"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
            error={touched.credit && !formData.credit}
            onBlur={() => handleBlur("credit")}
          />
          {touched.credit && !formData.credit && (
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
              !formData.debit ||
              !formData.credit ||
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

export default JournalEntryForm;
