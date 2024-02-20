import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
  IconButton,
  SelectChangeEvent,
  Autocomplete,
  Card,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { AppDispatch } from "../../app/store";

import dayjs from "dayjs";
import { CreateProductPurchase, CreatePurchase } from "../../models/purchase";
import { getProducts } from "../../features/product/productActions";
import { createPurchase } from "../../features/purchase/purchaseActions";
import { getDeclarations } from "../../features/declaration/declarationAction";
import { getDrivers } from "../../features/driver/driverActions";
interface PurchaseFormProps {
  open: boolean;
  handleClose: () => void;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: any) => state.product.products.items);
  const declarations = useSelector(
    (state: any) => state.declaration.declarations.items
  );
  const drivers = useSelector((state: any) => state.driver.drivers.items);
  const [formData, setFormData] = useState<CreatePurchase>({
    number: null,
    date: null,
    truckNumber: "",
    transportCost: null,
    eslCustomCost: null,
    transitFees: null,
    purchaseProducts: [
      {
        productId: "",
        declarationId: "",
        purchaseQuantity: null,
        purchaseUnitPrice: null,
      },
    ],
  });
  const [touched, setTouched] = useState<{
    number?: boolean;
    date?: boolean;
    truckNumber?: boolean;
    transportCost?: boolean;
    eslCustomCost?: boolean;
    transitFees?: boolean;
    purchaseProducts?: {
      [key: number]: {
        productId?: boolean;
        purchaseQuantity?: boolean;
        declarationId?: boolean;
        purchaseUnitPrice?: boolean;
      };
    };
  }>({});

  const [addedProducts, setAddedProducts] = useState<CreateProductPurchase[]>(
    []
  );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDeclarations());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDrivers());
  }, [dispatch]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProductChange =
    (index: number, field: keyof CreateProductPurchase) =>
    (e: SelectChangeEvent<string>) => {
      const newProducts = [...formData.purchaseProducts];
      newProducts[index] = {
        ...newProducts[index],
        [field]: e.target.value as string,
      };
      setFormData((prevData: any) => ({
        ...prevData,
        purchaseProducts: newProducts,
      }));
    };

  const handleAddProduct = () => {
    const newProduct = {
      productId: formData.purchaseProducts[0].productId,
      declarationId: formData.purchaseProducts[0].declarationId,
      purchaseQuantity: formData.purchaseProducts[0].purchaseQuantity,
      purchaseUnitPrice: formData.purchaseProducts[0].purchaseUnitPrice,
    };

    setAddedProducts((prevProducts) => [...prevProducts, newProduct]);
    setFormData((prevData: any) => ({
      ...prevData,
      purchaseProducts: [
        {
          productId: "",
          declarationId: "",
          purchaseQuantity: null,
          purchaseUnitPrice: null,
        },
      ],
    }));
  };

  const handleRemoveProduct = (index: number) => () => {
    setAddedProducts((prevProducts) =>
      prevProducts.filter((_, i) => i !== index)
    );
  };

  const handleEditProduct = (index: number) => () => {
    const productToEdit = addedProducts[index];
    setAddedProducts((prevProducts) =>
      prevProducts.filter((_, i) => i !== index)
    );
    setFormData((prevData: any) => {
      const newPurchaseProducts = [...prevData.purchaseProducts];
      newPurchaseProducts[index] = { ...productToEdit };
      return {
        ...prevData,
        purchaseProducts: newPurchaseProducts,
      };
    });
  };

  const handleSubmit = () => {
    const formDataToSend = {
      number: formData.number,
      date: formData.date,
      truckNumber: formData.truckNumber,
      transportCost: formData.transportCost,
      eslCustomCost: formData.eslCustomCost,
      transitFees: formData.transitFees,
      purchaseProducts: addedProducts,
    };

    dispatch(createPurchase(formDataToSend));
    setFormData({
      number: null,
      date: null,
      truckNumber: "",
      transportCost: null,
      eslCustomCost: null,
      transitFees: null,
      purchaseProducts: [
        {
          productId: "",
          declarationId: "",
          purchaseQuantity: null,
          purchaseUnitPrice: null,
        },
      ],
    });
    setAddedProducts([]);
    setTouched({});
    handleClose();
  };

  const handleCancel = () => {
    setFormData({
      number: null,
      date: null,
      truckNumber: "",
      transportCost: null,
      eslCustomCost: null,
      transitFees: null,
      purchaseProducts: [
        {
          productId: "",
          declarationId: "",
          purchaseQuantity: null,
          purchaseUnitPrice: null,
        },
      ],
    });
    setAddedProducts([]);
    setTouched({});
    handleClose();
  };

  const handleProductFormChange =
    (index: number, field: keyof CreateProductPurchase) =>
    (e: React.ChangeEvent<{ value: unknown }>) => {
      const newProducts = [...formData.purchaseProducts];
      newProducts[index] = {
        ...newProducts[index],
        [field]: e.target.value as string | number,
      };
      setFormData((prevData) => ({
        ...prevData,
        purchaseProducts: newProducts,
      }));
    };

  const isPurchaseFormValid = () => {
    return (
      formData.number !== null &&
      formData.date !== null &&
      addedProducts.length > 0 &&
      addedProducts.every(
        (product) =>
          product.purchaseQuantity !== null &&
          product.purchaseUnitPrice !== null
      )
    );
  };

  const isAddProductButtonDisabled = () => {
    return formData.purchaseProducts.some(
      (product) =>
        !product.productId ||
        product.productId === "" ||
        product.declarationId === "" ||
        product.purchaseQuantity === null ||
        product.purchaseQuantity <= 0 ||
        product.purchaseUnitPrice === null ||
        product.purchaseUnitPrice <= 0
    );
  };

  return (
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
          width: 500,
          maxHeight: "80vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, marginBottom: 2 }}
        >
          Purchase Form
        </Typography>
        <TextField
          name="number"
          label="Purchase Number"
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.number && !formData.number}
          onBlur={() => setTouched({ ...touched, number: true })}
        />
        {touched.number && !formData.number && (
          <FormHelperText error>Purchase number is required</FormHelperText>
        )}

        <TextField
          name="date"
          label="Purchase Date"
          variant="outlined"
          fullWidth
          margin="normal"
          type="date"
          value={dayjs(formData.date).format("YYYY-MM-DD")}
          onChange={handleChange}
          required
          error={touched.date && !formData.date}
          onBlur={() => setTouched({ ...touched, date: true })}
        />

        <Autocomplete
          options={drivers}
          getOptionLabel={(option) => option.truckNumber}
          value={
            drivers.find(
              (d: { truckNumber: string }) =>
                d.truckNumber === formData.truckNumber
            ) || null
          }
          onChange={(event, newValue) => {
            handleChange({
              target: {
                name: "truckNumber",
                value: newValue ? newValue.truckNumber : "",
              },
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Truck Number"
              variant="outlined"
              fullWidth
              required
              error={touched.truckNumber && !formData.truckNumber}
              onBlur={() => setTouched({ ...touched, truckNumber: true })}
            />
          )}
        />

        <TextField
          name="transportCost"
          label="Transport Cost"
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.transportCost && !formData.transportCost}
          onBlur={() => setTouched({ ...touched, transportCost: true })}
        />
        {touched.transportCost && !formData.transportCost && (
          <FormHelperText error>Transport cost is required</FormHelperText>
        )}
        <TextField
          name="eslCustomCost"
          label="ESL custom cost"
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.eslCustomCost && !formData.eslCustomCost}
          onBlur={() => setTouched({ ...touched, eslCustomCost: true })}
        />
        {touched.eslCustomCost && !formData.eslCustomCost && (
          <FormHelperText error>ESL custom cost is required</FormHelperText>
        )}

        <TextField
          name="transitFees"
          label="Transit fees"
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
          error={touched.transitFees && !formData.transitFees}
          onBlur={() => setTouched({ ...touched, transitFees: true })}
        />
        {touched.transitFees && !formData.transitFees && (
          <FormHelperText error>Transit fee is required</FormHelperText>
        )}

        <Typography>Add Products</Typography>

        {formData.purchaseProducts.map((product: any, index: any) => (
          <div key={index} style={{ marginBottom: 15 }}>
            <Autocomplete
              options={declarations}
              getOptionLabel={(option) => option.number}
              value={
                declarations.find(
                  (d: { id: any }) => d.id === product.declarationId
                ) || null
              }
              onChange={(event, newValue) => {
                handleProductChange(
                  index,
                  "declarationId"
                )({
                  target: { value: newValue ? newValue.id : "" },
                } as SelectChangeEvent<string>);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Declaration Number"
                  variant="outlined"
                  fullWidth
                  required
                  error={
                    touched.purchaseProducts?.[index]?.declarationId &&
                    !product.declarationId
                  }
                  sx={{ marginBottom: 1 }}
                />
              )}
            />

            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.name}
              value={
                products.find((p: { id: any }) => p.id === product.productId) ||
                null
              }
              onChange={(event, newValue) => {
                handleProductChange(
                  index,
                  "productId"
                )({
                  target: { value: newValue ? newValue.id : "" },
                } as SelectChangeEvent<string>);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Product"
                  variant="outlined"
                  fullWidth
                  required
                  error={
                    touched.purchaseProducts?.[index]?.productId &&
                    !product.productId
                  }
                  sx={{ marginBottom: 1 }}
                />
              )}
            />

            <TextField
              name={`PurchaseQuantity-${index}`}
              label="Purchase Quantity"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={product.purchaseQuantity === null ? '' : product.purchaseQuantity}
              onChange={handleProductFormChange(index, "purchaseQuantity")}
              required
              error={
                touched.purchaseProducts?.[index]?.purchaseQuantity &&
                !product.purchaseQuantity
              }
            />

            <TextField
              name={`purchaseUnitPrice-${index}`}
              label="Purchase Unit Price"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={product.purchaseUnitPrice === null ? '' : product.purchaseUnitPrice}
              onChange={handleProductFormChange(index, "purchaseUnitPrice")}
              required
              error={
                touched.purchaseProducts?.[index]?.purchaseUnitPrice &&
                !product.purchaseUnitPrice
              }
            />
          </div>
        ))}
        {addedProducts.length > 0 && (
          <Card sx={{ mt: 2, p: 2, bgcolor: "#f0f0f0" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, marginBottom: 1 }}
            >
              Added Products
            </Typography>
            {addedProducts.map((product, index) => {
              const productName =
                products.find((p: any) => p.id === product.productId)?.name ||
                "";
              const declarationNumber =
                declarations.find((d: any) => d.id === product.declarationId)
                  ?.number || "";

              return (
                <div key={index}>
                  <Typography variant="body1" component="div">
                    Product Name: {productName}, Quantity:{" "}
                    {product.purchaseQuantity}, Purchase Quantity:{" "}
                    {product.purchaseUnitPrice}, Declaration Number:{" "}
                    {declarationNumber}
                  </Typography>
                  <IconButton
                    onClick={handleEditProduct(index)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleRemoveProduct(index)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              );
            })}
          </Card>
        )}

        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddProduct}
          disabled={isAddProductButtonDisabled()}
          sx={{
            mt: 2,
            borderRadius: 20,
            color: "#2196F3",
            border: "2px solid #2196F3",
          }}
        >
          Add Product
        </Button>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!isPurchaseFormValid()}
          >
            Submit
          </Button>

          <Button
            variant="outlined"
            color="warning"
            onClick={handleCancel}
            sx={{ borderRadius: 20 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default PurchaseForm;
