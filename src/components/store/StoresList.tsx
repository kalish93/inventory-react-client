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

import StoreForm from './StoreForm';
import { AppDispatch } from '../../app/store';
import { selectStore } from '../../features/store/storeSlice';
import { deleteStore, getStores } from '../../features/store/storeActions';
import ConfirmationModal from '../common/confirmationModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const StoresList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const storeState = useSelector(selectStore);
  const { items: stores = [], currentPage, totalCount } = storeState.stores;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const {isError, error, loading} = useSelector(selectStore);

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

  const handleUpdateStore = () =>{
    
  }

  const handleDeleteStore = () =>{
    handleMenuClose();
    if (selectedStoreId !== null) {
      dispatch(deleteStore(selectedStoreId))
        .then(() => {
          if(!isError && !loading){
            showSnackbar('Store deleted successfully', 'success');
          }else{
            showSnackbar(error, 'error');
          }
        })
      }
  }

  const handleMenuOpen = (event: any, storeId: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedStoreId(storeId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStoreId(null);
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
    dispatch(getStores(page + 1, rowsPerPage));
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
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add store
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store: any) => (
              <TableRow key={store.id}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.address}</TableCell>  
                <TableCell>
                <IconButton
                    aria-label="Actions"
                    onClick={(event) => handleMenuOpen(event, store.id)}
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
                    <MenuItem onClick={handleUpdateStore}>Update</MenuItem>
                    <MenuItem onClick={openConfirmationModal}>Delete</MenuItem>
                  </Menu>
                  </TableCell>              
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <StoreForm open={openModal} handleClose={handleCloseModal} />
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title="Delete Store"
        content="Are you sure you want to delete this store?"
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

export default StoresList;
