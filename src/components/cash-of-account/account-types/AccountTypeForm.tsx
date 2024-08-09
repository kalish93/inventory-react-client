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
        initialValues={{ name: "" }}
        validate={(values) => {
          const errors: { name?: string } = {};
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
            {isSubType ? "Create Account Subtype" : "Create Account Type"}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column">
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
            <div style={{ display: "flex", gap: "8px", marginTop: "1rem" }}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button onClick={onClose} variant="outlined" color="warning">
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default CreateAccountTypeForm;
