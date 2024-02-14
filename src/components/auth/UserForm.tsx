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
  FormHelperText,
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
  const [touched, setTouched] = useState<{
    userName?: boolean;
    password?: boolean;
    passwordConfirmation?: boolean;
    roleId?: boolean;
  }>({});

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = () => {
    dispatch(signUpUser(formData));
    handleClose();
    // setTouched({});
  };

  const handleCancel = () => {
    handleClose();
    // setTouched({});
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
          required
          error={touched.userName && !formData.userName}
          onBlur={() => handleBlur('userName')}
        />
        {touched.userName && !formData.userName && <FormHelperText error>Username is required</FormHelperText>}
        <TextField
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.password && !formData.password}
          onBlur={() => handleBlur('password')}
        />
        {touched.password && !formData.password && <FormHelperText error>Password is required</FormHelperText>}
        <TextField
          name="passwordConfirmation"
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.passwordConfirmation && !formData.passwordConfirmation}
          onBlur={() => handleBlur('passwordConfirmation')}
        />
        {touched.passwordConfirmation && !formData.passwordConfirmation && <FormHelperText error>Confirmation is required</FormHelperText>}
        <FormControl fullWidth margin="normal" variant='filled'>
          <InputLabel>Role</InputLabel>
          <Select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            required
            error={touched.roleId && !formData.roleId}
            onBlur={() => handleBlur('roleId')}
          >
            {roles &&
              roles.map((role: Role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
          </Select>
          {touched.roleId && !formData.roleId && <FormHelperText error>Role is required</FormHelperText>}
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={
            !formData.userName ||
            !formData.password ||
            !formData.passwordConfirmation ||
            !formData.roleId
          }
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={handleCancel}
          sx={{ marginLeft: 1 }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default UserForm;
