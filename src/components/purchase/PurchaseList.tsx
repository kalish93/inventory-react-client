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
  MenuItem,
  Menu,
  Alert,
  Snackbar,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { AppDispatch } from "../../app/store";
import { selectPurchase } from "../../features/purchase/purchaseSlice";
import {
  deletePurchase,
  getPurchases,
} from "../../features/purchase/purchaseActions";
import PurchaseForm from "./PurchaseForm";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ConfirmationModal from "../common/confirmationModal";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";
import Transport from "./Transport";
import Esl from "./Esl";
import Transit from "./Transit";
import UpdatePurchaseForm from "./UpdatePurchaseForm";

const TabPanel = (props: {
  [x: string]: any;
  children: any;
  value: any;
  index: any;
}) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const PurchaseList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const PurchaseState = useSelector(selectPurchase);
  const {
    items: purchases = [],
    currentPage,
    totalCount,
  } = PurchaseState.purchases;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { error, isError } = useSelector(selectPurchase);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [value, setValue] = useState(0);
  const [openUpdateForm, setOpenUpdateForm] = useState(false); // State to control opening and closing of update form
  const [deleteSubmitted, setDeleteSubmitted] = useState(false); // State to control opening and closing of update form

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleDeletePurchase();
    closeConfirmationModal();
  };

  const handleUpdatePurchase = () => {
    setOpenUpdateForm(true);
    handleMenuClose();
  };

  const handleDeletePurchase = () => {
    handleMenuClose();
    if (selectedPurchaseId !== null) {
      dispatch(deletePurchase(selectedPurchaseId))
        .then(() => {
          dispatch(getPurchases(1,10));
          setDeleteSubmitted(true);
        })
        .catch(() => {
          setDeleteSubmitted(true);
        });
    }
  };

  useEffect(() => {
    if (deleteSubmitted) {
      if (isError) {
        showSnackbar('There are sales of this purchase. Please delete the sales first.', "error");
      } else {
        showSnackbar("Purchase deleted successfully", "success");
      }
      setDeleteSubmitted(false);
    }
    dispatch(getPurchases(1,10));
  }, [deleteSubmitted, error, isError]);

  const handleMenuOpen = (event: any, purchaseId: any, purchase: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedPurchaseId(purchaseId);
    setSelectedPurchase(purchase);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPurchaseId(null);
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
    dispatch(getPurchases(page + 1, rowsPerPage));
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
    setOpenUpdateForm(false);
    setOpenModal(false);
  };

  return (
    <div>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Purchases" />
        <Tab label="Transport" />
        <Tab label="ESL custom cost" />
        <Tab label="Transit Fees" />
      </Tabs>
      <TabPanel value={value} index={0}>
        {hasPermission(PERMISSIONS.CreatePurchase) && (
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Add Purchase
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
        {hasPermission(PERMISSIONS.GetPurchases) && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Purchase /Waybill Number</TableCell>
                  <TableCell>Purchase Date</TableCell>
                  <TableCell>Track Number</TableCell>
                  <TableCell>Exchange Rate</TableCell>
                  <TableCell>Supplier Name</TableCell>
                  <TableCell>Paid Amount ETB</TableCell>
                  <TableCell>Paid Amount USD</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.map((purchase: any) => (
                  <TableRow
                    key={purchase.id}
                    component={Link}
                    to={`/purchases/${purchase.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <TableCell>{purchase.number}</TableCell>
                    <TableCell>
                      {dayjs(purchase.date).format("MM/DD/YYYY")}
                    </TableCell>
                    <TableCell>{purchase.truckNumber}</TableCell>
                    <TableCell>{purchase.exchangeRate}</TableCell>
                    <TableCell>{purchase.supplier?.name}</TableCell>
                    <TableCell>
                      {purchase.paidAmountETB?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {purchase.paidAmountUSD?.toLocaleString()}
                    </TableCell>
                    <TableCell>{purchase.paymentStatus}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="Actions"
                        onClick={(event) => {
                          event.stopPropagation();
                          event.preventDefault(); // Prevent default behavior
                          handleMenuOpen(event, purchase.id, purchase);
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
                        {/* {hasPermission(PERMISSIONS.UpdatePurchase) && (
                          <MenuItem
                            onClick={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              handleUpdatePurchase();
                            }}
                          >
                            Update
                          </MenuItem>
                        )} */}
                        {hasPermission(PERMISSIONS.DeletePurchase) && (
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
        <PurchaseForm open={openModal} handleClose={handleCloseModal} />
        <UpdatePurchaseForm
          open={openUpdateForm}
          selectedPurchase={selectedPurchase}
          handleClose={handleCloseModal}
        />
        <ConfirmationModal
          open={confirmationModalOpen}
          onClose={closeConfirmationModal}
          onConfirm={handleConfirmAction}
          title="Delete Purchase"
          content="Are you sure you want to delete this Purchase?"
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Transport />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Esl />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Transit />
      </TabPanel>
    </div>
  );
};

export default PurchaseList;
