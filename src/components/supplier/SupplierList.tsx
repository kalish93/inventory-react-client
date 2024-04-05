import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from '@mui/material';
import { AppDispatch } from '../../app/store';
import { selectSupplier } from '../../features/supplier/supplierSlice';
import { deleteSupplier, getSuppliers } from '../../features/supplier/supplierActions';
import SupplierForm from './SupplierForm';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ConfirmationModal from '../common/confirmationModal';
import { hasPermission } from '../../utils/checkPermission';
import { PERMISSIONS } from '../../core/permissions';
import SupplierPaymentForm from '../ca-transaction/SupplierPaymentForm';

const SupplierList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const supplierState = useSelector(selectSupplier);
  const { items: suppliers = [], currentPage, totalCount } = supplierState.suppliers;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const {isError, error, loading} = useSelector(selectSupplier);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleDeleteStore();
    closeConfirmationModal();
  };

  const handleUpdateSupplier = () =>{
    handleOpenModal();
    handleMenuClose();
  }

  const handleDeleteStore = () =>{
    handleMenuClose();
    if (selectedSupplierId !== null) {
      dispatch(deleteSupplier(selectedSupplierId))
        .then(() => {
          if(!isError && !loading){
            showSnackbar('Supplier deleted successfully', 'success');
          }else{
            showSnackbar(error, 'error');
          }
        })
      }
  }

  const handleMenuOpen = (event: any, supplierId: any, supplier: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedSupplierId(supplierId);
    setSelectedSupplier(supplier)
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSupplierId(null);
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
    dispatch(getSuppliers(page + 1, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSupplierId(null);
    setSelectedSupplier(null)
  };
  return (
    <div>
      {hasPermission(PERMISSIONS.CreateSupplier) && <Button variant="contained" color="primary" onClick={handleOpenModal}>
       Add Supplier
      </Button>}
      <Button variant="contained" color="primary" onClick={handleOpenModal} style={{marginLeft:'10px'}}>
       Add Supplier Payment
      </Button>
      <TablePagination
         rowsPerPageOptions={[5, 10, 25]}
         component="div"
         count={totalCount || 0}
         rowsPerPage={rowsPerPage}
         page={(currentPage && currentPage > 0) ? currentPage - 1 : 0}
         onPageChange={handleChangePage}
         onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {hasPermission(PERMISSIONS.GetSuppliers) && <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier: any) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name }</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell>{supplier.currency}</TableCell>
                <TableCell>
                <IconButton
                    aria-label="Actions"
                    onClick={(event) => handleMenuOpen(event, supplier.id, supplier)}
                    style={{ margin: 0, padding: 0 }}
                  >
                   <MoreVertIcon/>
                  </IconButton>
                  <Menu
                    id="actions-menu"
                    MenuListProps={{
                      'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      style: {
                        width: '20ch',
                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)'
                      },
                    }}
                  >
                    {hasPermission(PERMISSIONS.UpdateSupplier) && <MenuItem onClick={handleUpdateSupplier}>Update</MenuItem>}
                    {hasPermission(PERMISSIONS.DeleteSupplier) && <MenuItem onClick={openConfirmationModal}>Delete</MenuItem>}
                  </Menu>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
      <SupplierForm open={openModal} handleClose={handleCloseModal} selectedSupplier={selectedSupplier}/>
      <SupplierPaymentForm
        open={openModal}
        handleClose={() => handleCloseModal()}
      />
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title="Delete Supplier"
        content="Are you sure you want to delete this supplier?"
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

export default SupplierList;
