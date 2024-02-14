import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { createDriver } from "../../features/driver/driverActions";
import { AppDispatch } from "../../app/store";

interface DriverFormProps {
  open: boolean;
  handleClose: () => void;
}

const DriverForm: React.FC<DriverFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    name: "",
    truckNumber: "",
    djboutiPhone: "",
    ethiopiaPhone: "",
    associationName: "",
    associationPhone: "",
    ownerName: "",
    ownerPhone: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    dispatch(createDriver(formData));
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
          Add Driver
        </Typography>
        <TextField
          required
          name="name"
          label="name"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="truckNumber"
          label="Truck Number"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="djboutiPhone"
          label="Djbouti Phone"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="ethiopiaPhone"
          label="Ethiopia Phone"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="associationName"
          label="Association Name"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="associationPhone"
          label="Association Phone"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="ownerName"
          label="Owner Name"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="ownerPhone"
          label="Owner Phone"
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

export default DriverForm;
