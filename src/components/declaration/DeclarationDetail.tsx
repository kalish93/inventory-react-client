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
  Typography,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { AppDispatch } from '../../app/store';
import { selectDeclaration } from '../../features/declaration/declarationSlice';
import { deleteDeclarationDetail, getDeclaration } from '../../features/declaration/declarationAction';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ConfirmationModal from '../common/confirmationModal';
import DeclarationDetailForm from './DeclarationDefailForm';

const DeclarationDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isDeleteSubmitted, setIsDeleteSubmitted] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // State for confirmation modal
  const [openModal, setOpenModal] = useState(false);
  const { isError, error, loading, declaration } = useSelector(selectDeclaration);
  const [selectedDeclarationDetailId, setSelectedDeclarationDetailId] = useState(null);
  const [selectedDeclarationDetail, setSelectedDeclarationDetail] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(getDeclaration(id));
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
    if(selectedDeclarationDetailId != null){
    dispatch(deleteDeclarationDetail(selectedDeclarationDetailId))
      .then(() => {
        setIsDeleteSubmitted(true);
      })
      .catch(() => {
        setIsDeleteSubmitted(true);
      });
    setConfirmationModalOpen(false); 
    setSelectedDeclarationDetail(null);
    setSelectedDeclarationDetailId(null);
    }// Close the confirmation modal after confirming delete
  };

  useEffect(() => {
    if (!loading && isDeleteSubmitted) {
      if (isError) {
        showSnackbar(error || 'An error occurred', 'error');
      } else {
        showSnackbar('Declaration detail deleted successfully', 'success');
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
    setSelectedDeclarationDetail(null);
    setSelectedDeclarationDetailId(null);
  };

  const handleMenuOpen = (event: any, id: any, data: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedDeclarationDetail(data);
    setSelectedDeclarationDetailId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!declaration) {
    return <Typography variant="body1">Declaration not found</Typography>;
  }

  return (
    <div>
      <div style={{display:"flex", justifyContent:'space-between', alignItems:'center' }}>
      <div>
      <Typography variant="h5" gutterBottom>
              Declaration Number: {declaration.number}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Declaration Date: {dayjs(declaration.date).format('YYYY-MM-DD')}
            </Typography>
      </div>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add Product
      </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Declaration Quantity</TableCell>
              <TableCell>Total Custom Tax</TableCell>
              <TableCell>Unit Custom Tax</TableCell>
              <TableCell>Purchased Quantity</TableCell>
              <TableCell>Declaration Balance</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {declaration.declarationProducts.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.declarationQuantity}</TableCell>
                <TableCell>{item.totalIncomeTax}</TableCell>
                <TableCell>{item.unitIncomeTax.toFixed(2)}</TableCell>
                <TableCell>{item.purchasedQuantity}</TableCell>
                <TableCell>{item.declarationBalance}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeclarationDetailForm open={openModal} handleClose={handleCloseModal} initialValues={selectedDeclarationDetail}/>

      <ConfirmationModal // Confirmation modal for delete
         open={confirmationModalOpen}
         onClose={closeConfirmationModal}
         onConfirm={handleConfirmAction}
        title="Delete Declaration"
        content="Are you sure you want to delete this declaration detail?"
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity as "success" | "error"}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DeclarationDetail;
