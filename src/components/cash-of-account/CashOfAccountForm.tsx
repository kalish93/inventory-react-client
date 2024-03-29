import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { selectAccountType } from '../../features/account-type/accountTypeSlice';
import { getAccountTypes } from '../../features/account-type/accountTypeActions';

interface CreateCashOfAccountFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const CreateCashOfAccountForm: React.FC<CreateCashOfAccountFormProps> = ({
    open,
    onClose,
    onSubmit,
  }) => {
    const dispatch = useDispatch<AppDispatch>();
    const accountTypeState = useSelector(selectAccountType);
    const accountTypes = accountTypeState.accountTypes;
    const [selectedAccountType, setSelectedAccountType] = useState('');
    const [accountSubTypes, setAccountSubTypes] = useState([]);
  
    useEffect(() => {
      dispatch(getAccountTypes());
    }, [dispatch]);
  
    useEffect(() => {
      if (selectedAccountType) {
        const selectedType = accountTypes.find((type: { id: string }) => type.id === selectedAccountType);
        setAccountSubTypes(selectedType ? selectedType.accountSubTypes : []);
      }
    }, [selectedAccountType, accountTypes]);
  
    const handleAccountTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setSelectedAccountType(event.target.value as string);
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <Formik
          initialValues={{ name: '', accountTypeId: '', accountSubTypeId: '' }}
          validate={(values) => {
            const errors: { name?: string; accountType?: string; accountSubType?: string } = {};
            if (!values.name) {
              errors.name = 'Name is required';
            }
            if (!values.accountSubTypeId) {
              errors.accountSubType = 'Account Sub Type is required';
            }
            return errors;
          }}
          onSubmit={(values, { resetForm }) => {
            values.accountTypeId = selectedAccountType
            onSubmit(values);
            resetForm();
            onClose();
          }}
        >        
        <Form>
          <DialogTitle>Create Cash of Account</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" mt={2}>
              <Field
                as={TextField}
                type="text"
                name="name"
                label="Name"
                variant="outlined"
                margin="normal"
                fullWidth
                helperText={<ErrorMessage name="name" />}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="accountTypeId">Account Type</InputLabel>
                <Field
                  as={Select}
                  name="accountTypeId"
                  variant="outlined"
                  fullWidth
                  onChange={handleAccountTypeChange}
                  value={selectedAccountType}
                  label="Account Type"
                  helperText={<ErrorMessage name="accountTypeId" />}
                >
                  {accountTypes.map((type: any) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="accountSubTypeId">Account Sub Type</InputLabel>
                <Field
                  as={Select}
                  name="accountSubTypeId"
                  variant="outlined"
                  fullWidth
                  label="Account Sub Type"
                  helperText={<ErrorMessage name="accountSubTypeId" />}
                >
                  {accountSubTypes.map((subType: any) => (
                    <MenuItem key={subType.id} value={subType.id}>
                      {subType.name}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create Cash of Account
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default CreateCashOfAccountForm;
