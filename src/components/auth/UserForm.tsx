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
import { signUpUser } from "../../features/user/userActions";
import { AppDispatch } from "../../app/store";
import { getRoles } from "../../features/role/roleActions";
import { Role } from "../../models/role";
import { selectUser } from "../../features/user/userSlice";

interface UserFormProps {
  open: boolean;
  handleClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ open, handleClose }) => {
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
      userName: "",
      password: "",
      passwordConfirmation: "",
      roleId: undefined,
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
      passwordConfirmation: Yup.string()
        .required("Confirmation is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
      roleId: Yup.string().required("Role is required"),
    }),

    onSubmit: (values) => {
      dispatch(signUpUser(values));
      handleClose();
      setIsFormSubmitted(true);
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (isFormSubmitted && !loading) {
      if (isError) {
        showSnackbar(error || "Unknown error", "error");
        setIsFormSubmitted(false);
      } else {
        showSnackbar("User registered successfully.", "success");
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
      <Modal
        open={open}
        onClose={(e, reason) => {
          if (reason === "backdropClick") {
            return;
          }
          handleClose();
        }}
      >
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
            User Form
          </Typography>
          <form onSubmit={formik.handleSubmit}>
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
              {formik.touched.userName && formik.errors.userName}
            </FormHelperText>
            <TextField
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
            <FormHelperText error>
              {formik.touched.password && formik.errors.password}
            </FormHelperText>
            <TextField
              name="passwordConfirmation"
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.passwordConfirmation}
              error={
                formik.touched.passwordConfirmation &&
                Boolean(formik.errors.passwordConfirmation)
              }
            />
            <FormHelperText error>
              {formik.touched.passwordConfirmation &&
                formik.errors.passwordConfirmation}
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
                {formik.touched.roleId && formik.errors.roleId}
              </FormHelperText>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formik.isValid}
            >
              Submit
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

export default UserForm;
