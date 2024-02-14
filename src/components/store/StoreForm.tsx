import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { createStore } from "../../features/store/storeActions";
import { AppDispatch } from "../../app/store";

interface StoreFormProps {
  open: boolean;
  handleClose: () => void;
}

const StoreForm: React.FC<StoreFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    dispatch(createStore(formData));
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
          Add Store
        </Typography>
        <TextField
          required
          name="name"
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="address"
          label="Address"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default StoreForm;
