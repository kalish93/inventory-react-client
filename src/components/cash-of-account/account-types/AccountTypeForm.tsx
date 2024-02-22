import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";

interface CreateAccountTypeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; accountTypeId?: string }) => void;
  isSubType?: boolean;
}

const CreateAccountTypeForm: React.FC<CreateAccountTypeFormProps> = ({
  open,
  onClose,
  onSubmit,
  isSubType = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Formik
        initialValues={{ name: ""}}
        validate={(values) => {
          const errors: { name?: string} = {};
          if (!values.name) {
            errors.name = "Name is required";
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values);
          resetForm();
          onClose();
        }}
      >
        <Form>
          <DialogTitle>
            {isSubType ? "Create Subtype" : "Create Account Type"}
          </DialogTitle>
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
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isSubType ? "Create Subtype" : "Create Account Type"}
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default CreateAccountTypeForm;
