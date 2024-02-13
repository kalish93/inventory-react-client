import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { signUpUser } from '../../features/user/userActions' ;
import { AppDispatch } from '../../app/store';
import { getRoles } from '../../features/role/roleActions';
import { Role } from '../../models/role';

interface UserFormProps {
    open: boolean;
    handleClose: () => void;
  }

const UserForm: React.FC<UserFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const roles = useSelector((state: any) => state.role.roles);
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    passwordConfirmation: '',
    roleId: undefined, 
  });

  useEffect(() => {
    dispatch(getRoles());
  },[dispatch]);
  
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    dispatch(signUpUser(formData));
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          User Form
        </Typography>
        <TextField
          name="userName"
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="passwordConfirmation"
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select name="roleId" value={formData.roleId} onChange={handleChange}>
          { roles && roles.map((role: Role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default UserForm;
