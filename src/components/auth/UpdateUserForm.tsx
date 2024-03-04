import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { updateUser } from "../../features/user/userActions";
import { AppDispatch } from "../../app/store";
import { Role } from "../../models/role";
import { selectUser } from "../../features/user/userSlice";
import { getRoles } from "../../features/role/roleActions";

interface UpdateUserFormProps {
  open: boolean;
  handleClose: () => void;
  user: any;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ open, handleClose, user }) => {
  const dispatch = useDispatch<AppDispatch>();
  const roles = useSelector((state: any) => state.role.roles);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { isError, error, loading } = useSelector(selectUser);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };


  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);
  
  const formik = useFormik({
    initialValues: {
      userName: user?.userName || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      roleId: user?.role ? user?.role?.id : undefined,
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Username is required"),
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      roleId: Yup.string().required("Role is required"),
    }),

    onSubmit: (values) => {
      dispatch(updateUser(values));
      setIsFormSubmitted(true);
      handleClose();
    },
  });

  useEffect(() => {
    if (user) {
      formik.setValues(user);
    }
  }, [user]);

  useEffect(() => {
    if (isFormSubmitted && !loading) {
      if (isError) {
        showSnackbar(error || "Unknown error", "error");
        setIsFormSubmitted(false);
      } else {
        showSnackbar("User Updated successfully.", "success");
        setIsFormSubmitted(false);
      }
    }
  }, [error, isError, isFormSubmitted, loading]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCancel = () => {
    handleClose();
    formik.resetForm();
  };

  return (
    <div>
      <Modal open={open} onClose={(e, reason) => {
          if (reason === "backdropClick") {
            return;
          }
          handleClose();
        }}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Update User
          </Typography>
          <form onSubmit={formik.handleSubmit}>
          <TextField
              name="firstName"
              label="First name"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            />
            <FormHelperText error>
              {formik.touched.firstName && formik.errors.firstName as React.ReactNode}
            </FormHelperText>
            <TextField
              name="lastName"
              label="Last name"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            />
            <FormHelperText error>
              {formik.touched.lastName && formik.errors.lastName as React.ReactNode}
            </FormHelperText>
            <TextField
              name="userName"
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userName}
              error={formik.touched.userName && Boolean(formik.errors.userName)}
            />
            <FormHelperText error>
              {formik.touched.userName && formik.errors.userName as React.ReactNode}
            </FormHelperText>
            
            <FormControl fullWidth margin="normal" variant="filled">
              <InputLabel>Role</InputLabel>
              <Select
                name="roleId"
                value={formik.values.roleId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.roleId && Boolean(formik.errors.roleId)}
              >
                {roles &&
                  roles.map((role: Role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText error>
                {formik.touched.roleId && formik.errors.roleId as React.ReactNode}
              </FormHelperText>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formik.isValid}
            >
              Update
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="warning"
              onClick={handleCancel}
              sx={{ marginLeft: 1 }}
            >
              Cancel
            </Button>
          </form>
        </Box>
      </Modal>
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

export default UpdateUserForm;
