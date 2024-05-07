import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectPurchase } from "../../features/purchase/purchaseSlice";

import {
  Alert,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { deleteTransportCost, getTransportCost } from "../../features/purchase/purchaseActions";
import dayjs from "dayjs";
import TransportExpensePayment from "../ca-transaction/TransportExpensePayment";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";
import ConfirmationModal from "../common/confirmationModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Transport = () => {
  const dispatch = useDispatch<AppDispatch>();
  const purchaseState = useSelector(selectPurchase);
  const {
    items: transport = [],
    currentPage,
    totalCount,
  } = purchaseState.transportCosts;
  const {error} = useSelector(selectPurchase);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [deleteSubmitted, setDeleteSubmitted] = useState(false); 
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    dispatch(getTransportCost(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleMenuOpen = (event: any, caId: any, ca: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedPaymentId(caId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPaymentId(null);
  };

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleDeleteTransportPayment();
    closeConfirmationModal();
  };


  const handleDeleteTransportPayment = () => {
    handleMenuClose();
    if (selectedPaymentId !== null) {
      dispatch(deleteTransportCost(selectedPaymentId))
        .then(() => {
          setDeleteSubmitted(true);
        })
        .catch(() => {
          setDeleteSubmitted(true);
        });
    }
    dispatch(getTransportCost(1, 10));
  };

  useEffect(() => {
    if (deleteSubmitted) {
      if (error) {
        showSnackbar(error, "error");
      } else {
        showSnackbar("Transport deleted successfully", "success");
      }
      setDeleteSubmitted(false);
    }
    dispatch(getTransportCost(1, 10));
  }, [deleteSubmitted, error]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <div>
      {hasPermission(PERMISSIONS.CreateTransportPayment) && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          style={{ marginLeft: "10px" }}
        >
          Add Transport Payment
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Transport Cost</TableCell>
              <TableCell>Truck Number</TableCell>
              <TableCell>Declaration Number</TableCell>
              <TableCell>Unit Transport Cost</TableCell>
              <TableCell>Purchase Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transport.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{dayjs(item.date).format("MM/DD/YYYY")}</TableCell>
                <TableCell>{item.cost}</TableCell>
                <TableCell>{item.purchase?.truckNumber}</TableCell>
                <TableCell>
                  {item?.productPurchase?.declaration?.number}
                </TableCell>
                <TableCell>{item.unitTransportCost?.toFixed(2)}</TableCell>
                <TableCell>{item.purchase?.number}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.paidAmount}</TableCell>
                <TableCell>{item.paymentStatus}</TableCell>
                {hasPermission(PERMISSIONS.DeleteTransportPayment) && item.type === "Payment" && ( <TableCell>
                      <IconButton
                        aria-label="Actions"
                        onClick={(event) => {
                          event.stopPropagation();
                          event.preventDefault(); // Prevent default behavior
                          handleMenuOpen(event, item.id, item);
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
                       
                          <MenuItem
                            onClick={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              openConfirmationModal();
                            }}
                          >
                            Delete
                          </MenuItem>
                        
                      </Menu>
                    </TableCell>
                    )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TransportExpensePayment
        open={openModal}
        handleClose={() => handleCloseModal()}
      />
       <ConfirmationModal
          open={confirmationModalOpen}
          onClose={closeConfirmationModal}
          onConfirm={handleConfirmAction}
          title="Delete Transport Payment"
          content="Are you sure you want to delete transport payment Entry?"
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

export default Transport;
