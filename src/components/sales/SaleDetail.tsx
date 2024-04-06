import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { selectSale } from "../../features/sales/salseSlice";
import { deleteSaleDetail, getSale } from "../../features/sales/salesActions";
import { selectPurchase } from "../../features/purchase/purchaseSlice";
import ConfirmationModal from "../common/confirmationModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SaleDetailForm from "./SaleDetailForm";

const SaleDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const saleState = useSelector(selectSale);
  const sale = saleState.sale;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isDeleteSubmitted, setIsDeleteSubmitted] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // State for confirmation modal
  const [openModal, setOpenModal] = useState(false);
  const { isError, error, loading } = useSelector(selectPurchase);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [selectedSaleDetail, setSelectedSaleDetail] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(getSale(id));
  }, [dispatch, id]);

  const handleUpdate = () => {
    handleOpenModal();
    handleMenuClose();
  };

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleConfirmDelete();
    closeConfirmationModal();
  };

  const handleConfirmDelete = () => {
    handleMenuClose();
    if (selectedSaleId != null) {
      dispatch(deleteSaleDetail(selectedSaleId))
        .then(() => {
          setIsDeleteSubmitted(true);
        })
        .catch(() => {
          setIsDeleteSubmitted(true);
        });
      setConfirmationModalOpen(false);
      setSelectedSaleDetail(null);
      setSelectedSaleId(null);
    } // Close the confirmation modal after confirming delete
  };

  useEffect(() => {
    if (!loading && isDeleteSubmitted) {
      if (isError) {
        showSnackbar(error || "An error occurred", "error");
      } else {
        showSnackbar("Sale detail deleted successfully", "success");
        // Redirect to the declarations list after successful deletion
      }
      setIsDeleteSubmitted(false);
    }
  }, [isError, error, isDeleteSubmitted, loading]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: any, severity: any) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSaleDetail(null);
    setSelectedSaleId(null);
  };

  const handleMenuOpen = (event: any, id: any, data: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedSaleDetail(data);
    setSelectedSaleId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!sale) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Typography variant="h5" gutterBottom>
            Invoice Number: {sale.invoiceNumber}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Invoice Date: {dayjs(sale.invoiceDate).format("DD/MM/YYYY")}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Customer Name: {sale.customer.firstName}
          </Typography>
        </div>
        {/* <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add Product
      </Button> */}
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Sale Quantity</TableCell>
              <TableCell>Sale Unit Price</TableCell>
              <TableCell>Total Sales</TableCell>
              <TableCell>Unit COGS</TableCell>
              <TableCell>Declaration Number</TableCell>
              <TableCell>Purchase/ Waybill Number</TableCell>
              {/* <TableCell>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {sale.saleDetails.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.saleQuantity.toLocaleString()}</TableCell>
                <TableCell>{item.saleUnitPrice.toLocaleString()}</TableCell>
                <TableCell>{item.totalSales.toLocaleString()}</TableCell>
                <TableCell>{item.unitCostOfGoods.toFixed(2)}</TableCell>
                <TableCell>{item.declaration.number}</TableCell>
                <TableCell>{item.purchase.number}</TableCell>
                {/* <TableCell>
                  <IconButton
                    aria-label="Actions"
                    onClick={(event) => handleMenuOpen(event, item.id, item)}
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
                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                        width: '20ch'
                      },
                    }}
                  >
                    <MenuItem onClick={handleUpdate}>Update</MenuItem>
                    <MenuItem onClick={openConfirmationModal}>Delete</MenuItem>
                  </Menu>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SaleDetailForm
        open={openModal}
        handleClose={handleCloseModal}
        initialValues={selectedSaleDetail}
      />

      <ConfirmationModal // Confirmation modal for delete
        open={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title="Delete Sale"
        content="Are you sure you want to delete this sale detail?"
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

export default SaleDetail;
