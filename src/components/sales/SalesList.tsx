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
  Alert,
  Snackbar,
} from "@mui/material";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { selectSale } from "../../features/sales/salseSlice";
import { AppDispatch } from "../../app/store";
import { getSales, deleteSale } from "../../features/sales/salesActions";
import SaleForm from "./SaleForm";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ConfirmationModal from "../common/confirmationModal";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";
import UpdateSaleForm from "./UpdateSaleForm";

const SalesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const SalesState = useSelector(selectSale);
  const { items: sales = [], currentPage, totalCount } = SalesState.sales;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { isError, error, loading } = useSelector(selectSale);
  const [selectedSale, setSelectedSale] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [deleteSubmitted, setDeleteSubmitted] = useState(false);

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleDeleteSale();
    closeConfirmationModal();
  };

  const handleUpdateSale = () => {
    handleOpenUpdateModal();
    handleMenuClose();
  };

  const handleDeleteSale = () => {
    handleMenuClose();
    if (selectedSaleId !== null) {
      dispatch(deleteSale(selectedSaleId))
        .then(() => {
          setDeleteSubmitted(true);
        })
        .catch(() => {
          setDeleteSubmitted(true);
        });
    }
  };

  useEffect(() => {
    if (deleteSubmitted) {
      if (error) {
        showSnackbar(error, "error");
      } else {
        showSnackbar("Sale deleted successfully", "success");
      }
      setDeleteSubmitted(false);
    }
  }, [deleteSubmitted, error]);

  const handleMenuOpen = (event: any, saleId: any, sale: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedSaleId(saleId);
    setSelectedSale(sale);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSaleId(null);
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
    dispatch(getSales(page + 1, rowsPerPage));
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
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleOpenUpdateModal = () => {
    setOpenUpdateModal(true);
  };

  return (
    <div>
      {hasPermission(PERMISSIONS.CreateSale) && (
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Sale
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
      {hasPermission(PERMISSIONS.GetSales) && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Invoice Date</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale: any) => (
                <TableRow
                  key={sale.id}
                  component={Link}
                  to={`/sales/${sale.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <TableCell>{sale.invoiceNumber}</TableCell>
                  <TableCell>
                    {dayjs(sale.invoiceDate).format("MM/DD/YYYY")}
                  </TableCell>
                  <TableCell>
                    {sale.customer?.firstName + " " + sale.customer?.lastName}
                  </TableCell>
                  <TableCell>{sale.paidAmount}</TableCell>
                  <TableCell>{sale.paymentStatus}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="Actions"
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault(); // Prevent default behavior
                        handleMenuOpen(event, sale.id, sale);
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
                      {/* {hasPermission(PERMISSIONS.UpdateSale) && (
                        <MenuItem
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            handleUpdateSale();
                          }}
                        >
                          Update
                        </MenuItem>
                      )} */}
                      {hasPermission(PERMISSIONS.DeleteSale) && (
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
      <SaleForm open={openModal} handleClose={handleCloseModal} />
      <UpdateSaleForm
        open={openUpdateModal}
        handleClose={handleCloseUpdateModal}
        selectedSale={selectedSale}
      />
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title="Delete Sale"
        content="Are you sure you want to delete this sale?"
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

export default SalesList;
