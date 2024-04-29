import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../common/confirmationModal";
import UnitOfMeasurementForm from "./UnitOfMeasurementForm";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";
import { deleteUnitOfMeasurement, getUnitOfMeasurements } from "../../features/product/productActions";

const UnitOfMeasurementList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: any) => state.product.unitOfMeasurements);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUnitOfMeasurementId, setSelectedUnitOfMeasurementId] = useState(null);
  const [selectedUnitOfMeasurement, setSelectedUnitOfMeasurement] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const error = useSelector((state: any) => state.product.error);
  const [deleteSubmitted, setDeleteSubmitted] = useState(false);


  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleDeleteUnitOfMeasurement();
    closeConfirmationModal();
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getUnitOfMeasurements());
  }, [dispatch]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (deleteSubmitted) {
      if (error) {
        showSnackbar(error, "error");
      } else {
        showSnackbar("Unit Of Measurement deleted successfully", "success");
      }
      setDeleteSubmitted(false);
    }
  }, [deleteSubmitted, error]);

  const handleDeleteUnitOfMeasurement = () => {
    handleMenuClose();
    if (selectedUnitOfMeasurementId !== null) {
      dispatch(deleteUnitOfMeasurement(selectedUnitOfMeasurementId))
        .then(() => {
          setDeleteSubmitted(true);
        })
        .catch(() => {
          setDeleteSubmitted(true);
        });
    }
  };

  const handleMenuOpen = (event: any, UnitOfMeasurementId: any, UnitOfMeasurement: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedUnitOfMeasurement(UnitOfMeasurement);
    setSelectedUnitOfMeasurementId(UnitOfMeasurementId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUnitOfMeasurementId(null);
    setSelectedUnitOfMeasurement(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      {hasPermission(PERMISSIONS.CreateUnitOfMeasurement) && 
      <Button variant="contained" color="primary" onClick={handleOpenModal} style={{marginBottom:'15px'}}>
        Add UnitOfMeasurement
      </Button>}
      {hasPermission(PERMISSIONS.GetProductCategories) && <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((UnitOfMeasurement: any) => (
              <TableRow key={UnitOfMeasurement.id}>
                <TableCell>{UnitOfMeasurement.name}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="Actions"
                    onClick={(event) => handleMenuOpen(event, UnitOfMeasurement.id, UnitOfMeasurement)}
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
                      },
                    }}
                  >
                    {hasPermission(PERMISSIONS.UpdateUnitOfMeasurement) && <MenuItem onClick={handleOpenModal}>Update</MenuItem>}
                    {hasPermission(PERMISSIONS.DeleteUnitOfMeasurement) && <MenuItem onClick={openConfirmationModal}>Delete</MenuItem>}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
      <UnitOfMeasurementForm open={openModal} handleClose={handleCloseModal} selectedUnitOfMeasurement={selectedUnitOfMeasurement}/>
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title="Delete UnitOfMeasurement"
        content="Are you sure you want to delete this UnitOfMeasurement?"
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

export default UnitOfMeasurementList;
