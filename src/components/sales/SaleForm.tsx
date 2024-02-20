import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { AppDispatch } from "../../app/store";
import { getProducts } from "../../features/product/productActions";
import { createSale } from "../../features/sales/salesActions";
import dayjs from "dayjs";
import { getCustomers } from "../../features/customer/customerActions";

interface SaleFormProps {
  open: boolean;
  handleClose: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: any) => state.product.products.items);
  const customers = useSelector((state: any) => state.customer.customers.items);
  const [formData, setFormData] = useState({
    invoiceNumber: 0,
    invoiceDate: null,
    customerId: "",
    productId: "",
    saleQuantity: 0,
    saleUnitPrice: 0,
  });
  const [touched, setTouched] = useState<{
    invoiceNumber?: boolean;
    invoiceDate?: boolean;
    customerId?: boolean;
    productId?: boolean;
    saleQuantity?: boolean;
    saleUnitPrice?: boolean;
  }>({});
  const [addedProducts, setAddedProducts] = useState<
    { productId: string; saleQuantity: number; saleUnitPrice: number }[]
  >([]);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleAddProduct = () => {
    setAddedProducts([
      ...addedProducts,
      {
        productId: formData.productId,
        saleQuantity: formData.saleQuantity,
        saleUnitPrice: formData.saleUnitPrice,
      },
    ]);
    setFormData({
      ...formData,
      productId: "",
      saleQuantity: 0,
      saleUnitPrice: 0,
    });
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...addedProducts];
    updatedProducts.splice(index, 1);
    setAddedProducts(updatedProducts);
  };

  const handleSubmit = () => {
    const combinedData = {
      ...formData,
      products: [...addedProducts],
    };
    dispatch(createSale(combinedData));
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
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
            width: 500,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
        }}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sales Form
        </Typography>
        <TextField
          name="invoiceNumber"
          label="Invoice Number"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.invoiceNumber && !formData.invoiceNumber}
          onBlur={() => handleBlur("invoiceNumber")}
        />
        {touched.invoiceNumber && !formData.invoiceNumber && (
          <FormHelperText error>Invoice number is required</FormHelperText>
        )}
        <TextField
          name="invoiceDate"
          label="Invoice Date"
          variant="outlined"
          fullWidth
          margin="normal"
          type="date"
          value={formData.invoiceDate || ""}
          onChange={handleChange}
          required
          error={touched.invoiceDate && !formData.invoiceDate}
          onBlur={() => setTouched({ ...touched, invoiceDate: true })}
        />

        <Autocomplete
          options={customers}
          getOptionLabel={(option) => option.firstName}
          value={
            customers.find(
              (d: { id: string }) => d.id === formData.customerId
            ) || null
          }
          onChange={(event, newValue) => {
            handleChange({
              target: {
                name: "customerId",
                value: newValue ? newValue.id : "",
              },
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Customer"
              variant="outlined"
              fullWidth
              required
              error={touched.customerId && !formData.customerId}
              onBlur={() => setTouched({ ...touched, customerId: true })}
            />
          )}
        />

        <Autocomplete
          options={products}
          getOptionLabel={(option) => option.name}
          value={
            products.find((p: { id: any }) => p.id === formData.productId) ||
            null
          }
          onChange={(event, newValue) => {
            handleChange({
              target: {
                name: "productId",
                value: newValue ? newValue.id : "",
              },
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Product"
              variant="outlined"
              fullWidth
              required
              error={touched.productId && !formData.productId}
              onBlur={() => setTouched({ ...touched, productId: true })}
            />
          )}
        />

<TextField
      name="saleQuantity"
      label="Sale Quantity"
      variant="outlined"
      fullWidth
      margin="normal"
      type="number"
      value={formData.saleQuantity === 0 ? '' : formData.saleQuantity}
      onChange={handleChange}
      required
      error={touched.saleQuantity && !formData.saleQuantity}
      onBlur={() => handleBlur("saleQuantity")}
    />
    {touched.saleQuantity && !formData.saleQuantity && (
      <FormHelperText error>Sale Quantity is required</FormHelperText>
    )}
    <TextField
      name="saleUnitPrice"
      label="Sale Unit Price"
      variant="outlined"
      fullWidth
      margin="normal"
      type="number"
      value={formData.saleUnitPrice === 0 ? '' : formData.saleUnitPrice}
      onChange={handleChange}
      required
      error={touched.saleUnitPrice && !formData.saleUnitPrice}
      onBlur={() => handleBlur("saleUnitPrice")}
    />
    {touched.saleUnitPrice && !formData.saleUnitPrice && (
      <FormHelperText error>Sale Unit Price is required</FormHelperText>
    )}
  

        {/* <TextField
          name="saleQuantity"
          label="Sale Quantity"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          onChange={handleChange}
          required
          error={touched.saleQuantity && !formData.saleQuantity}
          onBlur={() => handleBlur("saleQuantity")}
        />
        {touched.saleQuantity && !formData.saleQuantity && (
          <FormHelperText error>Sale Quantity is required</FormHelperText>
        )}
        <TextField
          name="saleUnitPrice"
          label="Sale Unit Price"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number" // Add type="number" here
          onChange={handleChange}
          required
          error={touched.saleUnitPrice && !formData.saleUnitPrice}
          onBlur={() => handleBlur("saleUnitPrice")}
        />
        {touched.saleUnitPrice && !formData.saleUnitPrice && (
          <FormHelperText error>Sale Unit Price is required</FormHelperText>
        )} */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProduct}
          sx={{ marginTop: 2 }}
        >
          Add Product
        </Button>
        {addedProducts.length > 0 && (
          <div>
            <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
              Added Products
            </Typography>
            <ul>
              {addedProducts.map((product, index) => (
                <li key={index}>
                  Product ID: {product.productId}, Quantity:{" "}
                  {product.saleQuantity}, Unit Price: {product.saleUnitPrice}
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleRemoveProduct(index)}
                    sx={{ marginLeft: 1 }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginTop: 2 }}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={handleCancel}
          sx={{ marginLeft: 1, marginTop: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default SaleForm;
