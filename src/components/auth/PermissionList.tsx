import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  Checkbox,
  Typography,
  Button,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { getPermissions } from "../../features/permission/permissionActions";
import { useParams } from "react-router-dom";
import {
  getRolePermissions,
  assignRevokePermissions,
} from "../../features/role/roleActions";
import { hasPermission } from "../../utils/checkPermission";
import { PERMISSIONS } from "../../core/permissions";

interface Permission {
  id: string;
  name: string;
}

interface RolePermissions {
  id: string;
  permissionId: string;
  roleId: string;
}

const PermissionList = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const permissions: Permission[] = useSelector(
    (state: any) => state.permission.permissions
  );
  const rolePermissions: RolePermissions[] = useSelector(
    (state: any) => state.role.rolePermissions
  );
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    dispatch(getPermissions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getRolePermissions(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (rolePermissions) {
      setCheckedPermissions(rolePermissions.map((rp) => rp.permissionId));
    }
  }, [rolePermissions]);

  const handleCheckboxChange = (permissionId: string) => {
    if (checkedPermissions.includes(permissionId)) {
      setCheckedPermissions((prev) => prev.filter((id) => id !== permissionId));
    } else {
      setCheckedPermissions((prev) => [...prev, permissionId]);
    }
  };

  const handleSaveChanges = () => {
    try {
      dispatch(
        assignRevokePermissions({ id: id, permissions: checkedPermissions })
      );
      showSnackbar("Permissions saved successfully", "success");
    } catch (error) {
      showSnackbar("Error saving permissions", "error");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <Typography variant="h5">Assign/Revoke Permissions</Typography>
        {hasPermission(PERMISSIONS.AssignRevokePermissions) && 
        <Button
          style={{ marginRight: "50px" }}
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
        >
          Save
        </Button>}
      </div>
      <Grid container spacing={2}>
        {permissions.map((permission) => (
          <Grid item key={permission.id} xs={12} sm={6} md={4} lg={3}>
            <Checkbox
              checked={checkedPermissions.includes(permission.id)}
              onChange={() => handleCheckboxChange(permission.id)}
            />
            <Typography>{permission.name}</Typography>
          </Grid>
        ))}
      </Grid>
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

export default PermissionList;
