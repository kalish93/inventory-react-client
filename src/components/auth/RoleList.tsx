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
import { deleteRole, getRoles } from "../../features/role/roleActions";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../common/confirmationModal";
import RoleForm from "./RoleForm";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";

const RoleList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const roles = useSelector((state: any) => state.role.roles);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const error = useSelector((state: any) => state.role.error);
  const [deleteSubmitted, setDeleteSubmitted] = useState(false);

  const navigate = useNavigate();

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleDeleteRole();
    closeConfirmationModal();
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getRoles());
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
        showSnackbar("Role deleted successfully", "success");
      }
      setDeleteSubmitted(false);
    }
  }, [deleteSubmitted, error]);

  const handleDeleteRole = () => {
    handleMenuClose();
    if (selectedRoleId !== null) {
      dispatch(deleteRole(selectedRoleId))
        .then(() => {
          setDeleteSubmitted(true);
        })
        .catch((error) => {
          setDeleteSubmitted(true);
        });
    }
  };

  const handleMenuOpen = (event: any, roleId: any, role: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
    setSelectedRoleId(roleId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRoleId(null);
    setSelectedRole(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleAssignRevokePermissions = () => {
    navigate(`/permissions/${selectedRoleId}`);
  };

  return (
    <div>
      {hasPermission(PERMISSIONS.CreateRole) && 
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add Role
      </Button>}
      {hasPermission(PERMISSIONS.GetRoles) && <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role: any) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="Actions"
                    onClick={(event) => handleMenuOpen(event, role.id, role)}
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
                    {hasPermission(PERMISSIONS.UpdateRole) && <MenuItem onClick={handleOpenModal}>Update</MenuItem>}
                    {hasPermission(PERMISSIONS.DeleteRole) && <MenuItem onClick={openConfirmationModal}>Delete</MenuItem>}
                    {hasPermission(PERMISSIONS.AssignRevokePermissions) && <MenuItem onClick={handleAssignRevokePermissions}>
                      Assign/Revoke Permissions
                    </MenuItem>}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
      <RoleForm open={openModal} handleClose={handleCloseModal} selectedRole={selectedRole}/>
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title="Delete User"
        content="Are you sure you want to delete this user?"
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

export default RoleList;
