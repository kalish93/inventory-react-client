import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  createAccountType,
  createAccountSubType,
  getAccountTypes,
} from "../../../features/account-type/accountTypeActions";
import { AppDispatch } from "../../../app/store";
import CreateAccountTypeForm from "./AccountTypeForm";
import AddIcon from "@mui/icons-material/Add";
import { selectAccountType } from "../../../features/account-type/accountTypeSlice";
import { hasPermission } from "../../../utils/checkPermission";
import { PERMISSIONS } from "../../../core/permissions";

const AccountTypeList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const accountTypeState = useSelector(selectAccountType);
  const accountTypes = accountTypeState.accountTypes;
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedAccountTypeId, setSelectedAccountTypeId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAccountTypes());
  }, [dispatch]);

  const handleCreateAccountType = (values: any) => {
    dispatch(createAccountType(values));
    setFormOpen(false);
  };

  const handleCreateSubType = (values: any) => {
    if (selectedAccountTypeId) {
      dispatch(createAccountSubType({ ...values, accountTypeId: selectedAccountTypeId }));
      setFormOpen(false);
    }
  };

  const openForm = (accountTypeId: string) => {
    setSelectedAccountTypeId(accountTypeId);
    setFormOpen(true);
  };

  const closeForm = () => {
    setSelectedAccountTypeId(null);
    setFormOpen(false);
  };

  if (!accountTypes) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Account Types</Typography>
        {hasPermission(PERMISSIONS.CreateAccountType) && <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => openForm("")}
        >
          Create Account Type
        </Button>}
      </div>
      {hasPermission(PERMISSIONS.GetAllAccountTypes) && <Grid container spacing={2}>
        {accountTypes.map((accountType: any) => (
          <Grid item key={accountType.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">{accountType.name}</Typography>
                <Typography variant="subtitle1">Account Subtypes:</Typography>
                <ul>
                  {accountType.accountSubTypes.map((subtype: any) => (
                    <li key={subtype.id}>{subtype.name}</li>
                  ))}
                </ul>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => openForm(accountType.id)}
                >
                  Add sub type
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>}
      <CreateAccountTypeForm
        open={isFormOpen}
        onClose={closeForm}
        onSubmit={selectedAccountTypeId ? handleCreateSubType : handleCreateAccountType}
        isSubType={selectedAccountTypeId ? true : false}
      />
    </div>
  );
};

export default AccountTypeList;
