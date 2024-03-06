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
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { deleteUser, getUsers } from '../../features/user/userActions';
import UserForm from './UserForm';
import { AppDispatch } from '../../app/store';
import { selectUser } from '../../features/user/userSlice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ConfirmationModal from '../common/confirmationModal';
import UpdateUserForm from './UpdateUserForm';
import RoleList from './RoleList';
import { hasPermission } from '../../utils/checkPermission';
import { PERMISSIONS } from '../../core/permissions';

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


const UsersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector(selectUser);
  const { items: users = [], currentPage, totalCount } = userState.users ;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedUserForUpdate, setSelectedUserForUpdate] = useState(null);
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };
  const handleUpdateModalOpen = () => {
    setOpenUpdateModal(true);
    handleMenuClose();
    
  };

  const handleUpdateModalClose = () => {
    setSelectedUserForUpdate(null);
    setOpenUpdateModal(false);
  };

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmAction = () => {
    handleDeleteUser();
    closeConfirmationModal();
  };


  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    dispatch(getUsers(page + 1, rowsPerPage));
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

  const handleDeleteUser = () =>{
    handleMenuClose();
    if (selectedUserId !== null) {
      dispatch(deleteUser(selectedUserId))
        .then(() => {
          showSnackbar('User deleted successfully', 'success');
        })
        .catch((error) => {
          showSnackbar(error,'error');
        });
    }
  }

  const handleMenuOpen = (event: any, userId: any, user: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserForUpdate(user);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
        <Tabs
        value={value}
        onChange={handleChange}
        centered
      >
        <Tab label="Users" />
        <Tab label="Roles" />
      </Tabs>
      <TabPanel value={value} index={0}>
      {hasPermission(PERMISSIONS.CreateUser) && <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add User
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
      {hasPermission(PERMISSIONS.GetUsers) && <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName + " " + user.lastName}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.role.name}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="Actions"
                    onClick={(event) => handleMenuOpen(event, user.id, user)}
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
                    {hasPermission(PERMISSIONS.UpdateUser) && <MenuItem onClick={handleUpdateModalOpen}>Update</MenuItem>}
                    {hasPermission(PERMISSIONS.DeleteUser) && <MenuItem onClick={openConfirmationModal}>Delete</MenuItem>}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
      <UserForm open={openModal} handleClose={handleCloseModal} />
      <UpdateUserForm
        open={openUpdateModal}
        handleClose={handleUpdateModalClose}
        user={selectedUserForUpdate}
      />
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
      </TabPanel>
      <TabPanel value={value} index={1}>
          <RoleList />
      </TabPanel>
    </div>
  );
};

export default UsersList;
