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
  Snackbar,
  Alert,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { AppDispatch } from "../../app/store";
import { selectDeclaration } from "../../features/declaration/declarationSlice";
import {
  deleteDeclaration,
  getDeclarations,
} from "../../features/declaration/declarationAction";
import DeclarationForm from "./DeclarationForm";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ConfirmationModal from "../common/confirmationModal";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";
import UpdateDeclarationForm from "./UpdateDeclarationForm";

const DeclarationList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const declarationState = useSelector(selectDeclaration);
  const {
    items: declarations = [],
    currentPage,
    totalCount,
  } = declarationState.declarations;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDeclarationId, setSelectedDeclarationId] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { isError, error, loading } = useSelector(selectDeclaration);
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [isDeleteSubmitted, setIsDeleteSubmitted] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false); // State to control opening and closing of update form

  const openConfirmationModal = (event: any) => {
    event.preventDefault();
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleDeleteDeclaration();
    closeConfirmationModal();
  };

  const handleUpdateDeclaration = (event: any) => {
    event.preventDefault();
    setOpenUpdateForm(true);
    handleMenuClose(); // Close the menu after selecting "Update"
  };

  const handleDeleteDeclaration = () => {
    handleMenuClose();

    if (selectedDeclarationId !== null) {
      dispatch(deleteDeclaration(selectedDeclarationId))
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
        showSnackbar("Declaration deleted successfully", "success");
      }
      setIsDeleteSubmitted(false);
    }
  }, [isError, error, isDeleteSubmitted, loading]);

  const handleMenuOpen = (event: any, declarationId: any, declaration: any) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelectedDeclarationId(declarationId);
    setSelectedDeclaration(declaration);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDeclarationId(null);
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
    dispatch(getDeclarations(page + 1, rowsPerPage));
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
    setOpenUpdateForm(false);
    setSelectedDeclaration(null);
  };

  return (
    <div>
      {hasPermission(PERMISSIONS.CreateDeclaration) && (
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Declaration
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
      {hasPermission(PERMISSIONS.GetDeclarations) && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Declaration Number</TableCell>
                <TableCell>Declaration Date</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {declarations.map((declaration: any) => (
                <TableRow
                  key={declaration.id}
                  component={Link}
                  to={`/declarations/${declaration.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <TableCell>{declaration.number}</TableCell>
                  <TableCell>
                    {dayjs(declaration.date).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {declaration.paidAmount !== 0
                      ? declaration.paidAmount?.toLocaleString()
                      : null}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="Actions"
                      onClick={(event) =>
                        handleMenuOpen(event, declaration.id, declaration)
                      }
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
                      {hasPermission(PERMISSIONS.UpdateDeclaration) && (
                        <MenuItem
                          onClick={(event) => handleUpdateDeclaration(event)}
                        >
                          Update
                        </MenuItem>
                      )}
                      {hasPermission(PERMISSIONS.DeleteDeclaration) && (
                        <MenuItem
                          onClick={(event) => openConfirmationModal(event)}
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
      <DeclarationForm open={openModal} handleClose={handleCloseModal} />
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title="Delete Driver"
        content="Are you sure you want to delete this declaration?"
      />

      <UpdateDeclarationForm
        open={openUpdateForm}
        selectedDeclaration={selectedDeclaration} // Pass the selected declaration as initialValues
        handleClose={handleCloseModal} // Close the update form
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

export default DeclarationList;
