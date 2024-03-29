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

import DriverForm from './DriverForm';
import { AppDispatch } from '../../app/store';
import { selectDrivers } from '../../features/driver/driverSlice';
import { deleteDriver, getDrivers } from '../../features/driver/driverActions';
import ConfirmationModal from '../common/confirmationModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { hasPermission } from '../../utils/checkPermission';
import { PERMISSIONS } from '../../core/permissions';

const DriversList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const driverState = useSelector(selectDrivers);
  const { items: drivers = [], currentPage, totalCount } = driverState.drivers;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const {isError, error, loading} = useSelector(selectDrivers);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleDeleteDriver();
    closeConfirmationModal();
  };

  const handleUpdateDriver = () =>{
      handleOpenModal();
      handleMenuClose();
  }

  const handleDeleteDriver = () =>{
    handleMenuClose();

    if (selectedDriverId !== null) {
      dispatch(deleteDriver(selectedDriverId))
        .then(() => {
          if(!isError && !loading){
            showSnackbar('Driver deleted successfully', 'success');
          }else{
            showSnackbar(error, 'error');
          }
        })
      }
  }

  const handleMenuOpen = (event: any, driverId: any, driver: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedDriverId(driverId);
    setSelectedDriver(driver)
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDriverId(null);
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
    dispatch(getDrivers(page + 1, rowsPerPage));
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
    setSelectedDriverId(null);
    setSelectedDriver(null)
  };

  return (
    <div>
      {hasPermission(PERMISSIONS.CreateDriver) && <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add Driver
      </Button>}
      <TablePagination
         rowsPerPageOptions={[5, 10, 25]}
         component="div"
         count={totalCount || 0}
         rowsPerPage={rowsPerPage}
         page={(currentPage && currentPage > 0) ? currentPage - 1 : 0}
         onPageChange={handleChangePage}
         onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {hasPermission(PERMISSIONS.GetDrivers) && <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Truck Number</TableCell>
                <TableCell>Djbouti Phone</TableCell>
                <TableCell>Ethiopia Phone</TableCell>
                <TableCell>Association Name</TableCell>
                <TableCell>Association Phone</TableCell>
                <TableCell>Owner Name</TableCell>
                <TableCell>Owner Phone</TableCell>
                <TableCell>Driver Id</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver: any) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.truckNumber}</TableCell>
                <TableCell>{driver.djboutiPhone}</TableCell>
                <TableCell>{driver.ethiopiaPhone}</TableCell>
                <TableCell>{driver.associationName}</TableCell>
                <TableCell>{driver.associationPhone}</TableCell>
                <TableCell>{driver.ownerName}</TableCell>
                <TableCell>{driver.ownerPhone}</TableCell>  
                <TableCell>{driver.driverId}</TableCell>
                <TableCell>
                <IconButton
                    aria-label="Actions"
                    onClick={(event) => handleMenuOpen(event, driver.id, driver)}
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
                    {hasPermission(PERMISSIONS.UpdateDriver) && <MenuItem onClick={handleUpdateDriver}>Update</MenuItem>}
                    {hasPermission(PERMISSIONS.DeleteDriver) && <MenuItem onClick={openConfirmationModal}>Delete</MenuItem>}
                  </Menu>
                  </TableCell>              
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
      <DriverForm open={openModal} handleClose={handleCloseModal} selectedDriver={selectedDriver}/>
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title="Delete Driver"
        content="Are you sure you want to delete this driver?"
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

export default DriversList;
