import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

import BankForm from "./bankForm";
import { AppDispatch } from "../../app/store";
import { selectBank } from "../../features/bank/bankSlice";
import { deleteBank, getBanks } from "../../features/bank/bankActions";
import ConfirmationModal from "../common/confirmationModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const BanksList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const bankState = useSelector(selectBank);
  const { items: banks = [], currentPage, totalCount } = bankState.banks;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isDeleteSubmitted, setIsDeleteSubmitted] = useState(false);
  const { isError, error, loading } = useSelector(selectBank);
  const [selectedBank, setSelectedBank] = useState(null);

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleDeleteBank();
    closeConfirmationModal();
  };

  const handleUpdateBank = () => {
    handleOpenModal();
    handleMenuClose();
  };

  const handleDeleteBank = () => {
    handleMenuClose();
    if (selectedBankId !== null) {
      dispatch(deleteBank(selectedBankId))
        .then(() => {
          setIsDeleteSubmitted(true);
        })
        .catch(() => {
          setIsDeleteSubmitted(true);
        });
    }
  };

  useEffect(() => {
    if (!loading && isDeleteSubmitted) {
      if (isError) {
        showSnackbar(error || "An error occurred", "error");
      } else {
        showSnackbar("Bank deleted successfully", "success");
      }
      setIsDeleteSubmitted(true);
    }
  }, [isError, error, isDeleteSubmitted, loading]);

  const handleMenuOpen = (event: any, bankId: any, bank: any) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelectedBankId(bankId);
    setSelectedBank(bank);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBankId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getBanks(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBankId(null);
    setSelectedBank(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {hasPermission(PERMISSIONS.CreateBank) && (
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Bank
        </Button>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount || 0}
        rowsPerPage={rowsPerPage}
        page={currentPage && currentPage > 0 ? currentPage - 1 : 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {hasPermission(PERMISSIONS.GetBanks) && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Starting Value</TableCell>
                <TableCell>Starting Date</TableCell>

                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banks &&
                banks.map((bank: any) => (
                  <TableRow
                    key={bank.id}
                    component={Link}
                    to={`/banks/${bank.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <TableCell>{bank.name}</TableCell>
                    <TableCell>{bank.address}</TableCell>
                    <TableCell>{bank.startingValue.toLocaleString()}</TableCell>
                    <TableCell>
                      {dayjs(bank.startingValueDate).format("MM/DD/YYYY")}
                    </TableCell>

                    <TableCell>
                      <IconButton
                        aria-label="Actions"
                        onClick={(event) => {
                          event.stopPropagation();
                          event.preventDefault();
                          handleMenuOpen(event, bank.id, bank);
                        }}
                        style={{ margin: 0, padding: 0 }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="actions-menu"
                        MenuListProps={{
                          "aria-labelledby": "long-button",
                        }}
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                          style: {
                            width: "20ch",
                            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        {hasPermission(PERMISSIONS.UpdateBank) && (
                          <MenuItem
                            onClick={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              handleUpdateBank();
                            }}
                          >
                            Update
                          </MenuItem>
                        )}
                        {hasPermission(PERMISSIONS.DeleteBank) && (
                          <MenuItem
                            onClick={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              openConfirmationModal();
                            }}
                          >
                            Delete
                          </MenuItem>
                        )}
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <BankForm
        open={openModal}
        handleClose={handleCloseModal}
        selectedBank={selectedBank}
      />
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title="Delete Bank"
        content="Are you sure you want to delete this bank?"
      />
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

export default BanksList;
